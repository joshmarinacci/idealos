const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const WebSocketServer = require('ws');
console.log("starting it up");
const DB = require('./livedb').make({path: "tempdb.json"});


var HTTP_PORT = 5151;
var WEBSOCKET_PORT = 5150;

DB.importDocs(require('./example_docs'));

function handleInfo(res) {
    console.log("doing info");
    res.send(JSON.stringify({
        success: true,
        message: "the server is running fine"
    }));
}

function handleDBQuery(conn, req) {
    console.log("doing a database query", req);
    DB.query(req).then((docs) => {
        conn.send(JSON.stringify(docs));
    });
}

function handleDBSubscribe(conn, req) {
    console.log("doing a database subscribe",req);
    var lq = DB.makeLiveQuery(req.query);
    lq.on("update", (id,docs)=>{
        console.log("the live query updated",conn.readyState);
        if(conn.readyState === WebSocketServer.OPEN) {
            conn.send(JSON.stringify({type: "queryupdate", queryId:id,docs: docs}));
        }
    });
    if(conn.readyState === WebSocketServer.OPEN) {
        conn.send(JSON.stringify({type: "querycreated", queryId:lq.id, messageId:req.messageId}));
    }
}

const server = new WebSocketServer.Server({port: WEBSOCKET_PORT});
server.on('connection', (conn) => {
    // console.log('got a websocket connection');
    conn.on('close', function () {
        console.log("closed the connection");
    });
    conn.on('open', function (msg) {
        console.log("connection opened");
    });
    conn.on('message', function (e) {
        var msg = JSON.parse(e);
        if (!msg.command) return handleInfo(conn);
        if (msg.command === 'info') return handleInfo(conn);
        if (msg.command === 'db') return handleDBQuery(conn, msg);
        if (msg.command === 'subscribe') return handleDBSubscribe(conn,msg);
        console.log("unhandled websocket message ", msg);
    });
});


function startWebserver(cb) {
    const app = express();
    //make all JSON endpoints be rendered pretty
    app.set("json spaces", 4);

    //turn on cross origin resource support
    app.use(cors({origin: true, credentials: true}));

    //assume all bodies will be JSON and parse them automatically
    app.use(bodyParser.json());

    app.post('/api/dbquery', function(req,res) {
        console.log("got a query", req.body);
        DB.query(req.body).then((docs)=>{
            res.json(docs);
            res.end();
        });
    });

    app.post('/api/dbinsert', function(req,res) {
        console.log("got an insert", req.body);
        DB.insert(req.body).then((resp)=>{
            res.json({status:'success'});
            res.end();
        })
    });

    app.post('/api/updateQuery', function(req,res) {
        DB.updateLiveQuery(req.body.queryId,req.body.query);
        res.json({status:'success'});
        res.end();
    });

    app.listen(HTTP_PORT, function () {
        console.log("ready to serve on http://localhost:" + HTTP_PORT + "/");
        if (cb) cb();
    });
}

startWebserver()