import {GET_JSON, POST_JSON} from "./NetUtils";

class LiveQuery {
    constructor(db,q) {
        this.cbs = {
            update:[],
            execute:[]
        };
        this.db = db;
        this.query = q;
        // console.log('created a live query');

        this.db.subscribe(q,(docs)=>{
            // console.log('subscription got some docs',docs);
            if(docs.type==='querycreated') {
                this.id = docs.queryId;
            }
        })
    }

    on(type,cb) {
        this.cbs[type].push(cb);
    }

    updateQuery(q) {
        this.db.updateQuery(this.id,q);
    }

    update(msg) {
        // console.log("live query", this.id,"got an update message",msg);
        if(msg.type === 'queryupdate') {
            // console.log("clearing first");
            this.data = [];
        }
        msg.docs.forEach((d)=>{
            this.data.push(d);
        });
        // console.log("new data is",this.data);
        this.cbs.update.forEach((cb)=>cb(this.data));
    }


    execute() {
        this.data = [];
        this.db.query(this.query).then((docs)=>{
            this.data = docs;
            this.cbs.execute.forEach((cb)=>cb(docs));
        });
        return [];
    }
}

export default class {
    constructor(app) {
        this.app = app;
        this.cbs = {
            connect:[],
            receive:[],
            clipboard:[],
        };
        this.pending = [];
        this.queries = [];
        this.messageListeners = [];
    }
    connect() {
        function log(...rest) {
            console.log(...rest);
        };
        // console.log("connecting");
        this.ws = new WebSocket('ws://localhost:5150');
        this.ws.onerror = () => log('WebSocket error');
        this.ws.onopen = () => {
            // log('WebSocket connection established');
            this.cbs.connect.forEach((cb)=>cb("connected"));
        };
        this.ws.onclose = () => log('WebSocket connection closed');
        this.ws.onmessage =  (event) =>  this.dispatchMessage(JSON.parse(event.data));

        GET_JSON("http://localhost:5151/api/info").then((answer) => {
            // console.log("connection to server said",answer);
        });
    }

    listenMessages(cb) {
        this.messageListeners.push(cb);
    }

    dispatchMessage(msg) {
        this.messageListeners.forEach((cb)=>cb(msg));
        if(msg.type==='queryupdate') {
            // console.log('live query updated',msg.queryId);
            this.queries.forEach((q)=>{
                if(q.id === msg.queryId) {
                    // console.log("query match");
                    q.update(msg);
                }
            })
            return;

        }
        if(msg.type === 'querycreated') {
            // console.log("query was created with id",msg.queryId, msg.messageId);
            if(this.pending[msg.messageId]) {
                this.pending[msg.messageId](msg);
                delete this.pending[msg.messageId];
            }
            return;
        }
        // console.log("message arrived",msg);
        if(msg.type === 'command') {
            if(msg.command === 'launch') this.app.launch(msg);
            if(msg.command === 'close')  this.app.close(msg);
            if(msg.command === 'resize') this.app.resize(msg);
        }
        if(msg.type === 'clipboard') this.cbs['clipboard'].forEach((cb)=>cb(msg));
    }

    on(type,cb) {
        if(!this.cbs[type]) throw new Error(`incorrect event type: '${type}'`);
        this.cbs[type].push(cb);
    }

    sendMessage(msg) {
        console.log("sending message",msg);
        this.ws.send(JSON.stringify(msg));
    }

    subscribe(q,cb) {
        const id = "mid_"+Math.floor(Math.random()*10000);
        this.pending[id] = cb;
        this.ws.send(JSON.stringify({command:'subscribe',query:q,"messageId":id}));
    }

    updateQuery(id,q) {
        return POST_JSON("http://localhost:5151/api/updateQuery",{queryId:id,query:q});
    }

    query(q) {
        return POST_JSON("http://localhost:5151/api/dbquery",q).then((answer)=>{
            // console.log("the query response is", answer);
            return answer;
        });
    }

    insert(doc) {
        return POST_JSON("http://localhost:5151/api/dbinsert",doc).then((answer)=>{
            // console.log("the insert response is", answer);
            return answer;
        });
    }


    makeLiveQuery(q) {
        var lq  = new LiveQuery(this,q);
        this.queries.push(lq);
        return lq;
    }
}
