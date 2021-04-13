const PATHS = require("path");
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const WebSocketServer = require('ws');


const HTTP_PORT = 5151;
const WEBSOCKET_PORT = 5150;

// Command line parameters
var persistent = false;
var reload = false;
for (var i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === "mongo") persistent = true;
    if (process.argv[i] === "reload") reload = true;
}
const dbProvider = persistent ? './persistdb' : './livedb';
const DB = require(dbProvider).make({path: "tempdb.json"});


// DB.makeLiveQuery({type:'alarm'},{order:{time:true}}).execute();

function handleInfo(res) {
    res.send(JSON.stringify({
        success: true,
        message: "the server is running fine"
    }));
}

function handleDBQuery(conn, req) {
    DB.query(req).then((docs) => {
        conn.send(JSON.stringify(docs));
    });
}

function handleDBSubscribe(conn, req) {
    var lq = DB.makeLiveQuery(req.query, req.settings);
    lq.on("update", (id,docs)=>{
        if(conn.readyState === WebSocketServer.OPEN) {
            conn.send(JSON.stringify({type: "queryupdate", queryId:id,docs: docs}));
        }
    });
    if(conn.readyState === WebSocketServer.OPEN) {
        conn.send(JSON.stringify({type: "querycreated", queryId:lq.id, messageId:req.messageId}));
    }
}

const conns = [];
function bounceBack(msg) {
    conns.forEach((conn)=> {
        if (conn.readyState === WebSocketServer.OPEN) {
            conn.send(JSON.stringify(msg));
        }
    });
}

DB.sendMessage = (msg)=>{
    bounceBack(msg);
};

const server = new WebSocketServer.Server({port: WEBSOCKET_PORT});
server.on('connection', (conn) => {
    conns.push(conn);
    conn.on('close', function () {
        console.log("closed the connection");
    });
    conn.on('open', function (msg) {
        console.log("connection opened");
    });
    conn.on('message', function (e) {
        var msg = JSON.parse(e);
        if (msg.type === 'clipboard') return bounceBack(msg);
        if (!msg.command) return handleInfo(conn);
        if (msg.command === 'info') return handleInfo(conn);
        if (msg.command === 'db') return handleDBQuery(conn, msg);
        if (msg.command === 'subscribe') return handleDBSubscribe(conn,msg);
        return bounceBack(msg);
    });
});




function doMissing(res) {
    res.set('Content-Type','text/html');
    res.send("<html><body><h1>cannot find the content</h1></body>");
    res.end();
}
function doFile(doc,res) {
    var path = PATHS.join(process.cwd(),'resources', doc.url.slice("resource:".length));
    res.sendFile(path);
}


function startWebserver(cb) {
    const app = express();
    //make all JSON endpoints be rendered pretty
    app.set("json spaces", 4);

    //turn on cross origin resource support
    app.use(cors({origin: true, credentials: true}));

    //assume all bodies will be JSON and parse them automatically
    app.use(bodyParser.json());

    app.get('/api/info', (req,res)=>{
        res.json({status:'success'});
        res.end();
    });
    app.post('/api/dbquery', function(req,res) {
        DB.query(req.body.query).then((docs)=>{
            res.json(docs);
            res.end();
        });
    });

    app.post('/api/dbinsert', function(req,res) {
        DB.insert(req.body).then((doc)=>{
            res.json({status:'success', doc:doc});
            res.end();
        })
    });

    app.post('/api/dbupdate', function(req,res) {
        DB.update(req.body).then((resp)=>{
            res.json({status:'success'});
            res.end();
        })
    });

    app.post('/api/dbdelete', function(req,res) {
        DB.delete(req.body).then((resp)=>{
            res.json({status:'success'});
            res.end();
        })
    });



    app.post('/api/updateQuery', function(req,res) {
        DB.updateLiveQuery(req.body.queryId,req.body.query);
        res.json({status:'success'});
        res.end();
    });

    app.get('/api/resource/:id', (req,res)=>{
        DB.query({id:req.params.id}).then((docs)=>{
            if(!docs) return doMissing(res);
            var doc = docs[0];
            if(!doc) return doMissing(res);
            if(doc.type !== 'image') return doMissing(res);
            if(!doc.url) return doMissing(res);
            return doFile(doc,res);
        }).catch((e)=>{
            console.log(e);
            doMissing(res);
        });
    });


    app.listen(HTTP_PORT, function () {
        console.log("ready to serve on http://localhost:" + HTTP_PORT + "/");
        if (cb) cb();
    });
}

DB.connect(function() {
   if (!persistent)
       DB.importDocs(require('./example_docs'));
   if (persistent && reload) {
       DB.reset();	
       DB.importDocs(require('./example_docs'));
   }
   startWebserver();
})
