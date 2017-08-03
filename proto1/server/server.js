const WebSocketServer = require('ws');
console.log("starting it up");
const DB = require('./livedb').make({path:"tempdb.json"});

DB.importDocs(require('./example_docs'));

function handleInfo(res) {
    console.log("doing info");
    res.send(JSON.stringify({
        success:true,
        message:"the server is running fine"
    }));
}

function handleDBQuery(conn, req) {
    console.log("doing a database query", req);
    DB.query(req).then((docs)=>{
        conn.send(JSON.stringify(docs));
    });
}

const server = new WebSocketServer.Server({port:5150});
server.on('connection',(conn)=> {
    console.log('got a websocket connection');
    conn.on('close', function() {
        console.log("closed the connection");
    });
    conn.on('open', function(msg) {
        console.log("connection opened");
    });
    conn.on('message', function(e) {
        var msg = JSON.parse(e);
        console.log("message is", msg);
        if(!msg.command) return handleInfo(conn);
        if(msg.command === 'info') return handleInfo(conn);
        if(msg.command === 'db') return handleDBQuery(conn,msg);
    });
});


