import {GET_JSON, POST_JSON} from "./NetUtils";

class LiveQuery {
    constructor(db,q) {
        this.cbs = {
            update:[],
            execute:[]
        };
        this.db = db;
        this.query = q;

        this.db.whenConnected(()=>{
            this.db.subscribe(q, (docs) => {
                // console.log('subscription got some docs',docs);
                if (docs.type === 'querycreated') {
                    this.id = docs.queryId;
                }
            });
        });
    }

    on(type,cb) {
        this.cbs[type].push(cb);
    }

    updateQuery(q) {
        this.query = q;
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
        this.cbs.update.forEach((cb)=>cb(this.data));
    }

    sendDocumentUpdate(doc) {
        this.db.update(doc);
    }

    sendDocumentDelete(doc) {
        this.db.delete(doc);
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

export default class RemoteDB {
    constructor(id) {
        this.id = id;
        this.DEBUG = false;
        this.workspace = 'single';
        this.cbs = {
            connect:[],
            receive:[],
            clipboard:[],
        };
        this.pending = [];
        this.queries = [];
        this.messageListeners = [];
        this.connected = false;
    }
    connect() {
        this.log("connecting to the server");
        this.ws = new WebSocket('ws://localhost:5150');
        this.ws.onerror = () => this.log('WebSocket error');
        this.ws.onopen = () => {
            this.log('WebSocket connection established');
            this.connected = true;
            this.cbs.connect.forEach((cb)=>cb("connected"));
        };
        this.ws.onclose = () => this.log('WebSocket connection closed');
        this.ws.onmessage =  (event) =>  this.dispatchMessage(JSON.parse(event.data));

        GET_JSON("http://localhost:5151/api/info").then((answer) => {
            this.log("connection to server said",answer);
        });
    }

    whenConnected(cb) {
        if(this.connected) return cb();
        this.on("connect",cb);
    }

    listenMessages(cb) {
        this.messageListeners.push(cb);
    }

    dispatchMessage(msg) {
        this.log(" received message",msg);
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
        if(msg.type === 'clipboard') this.cbs['clipboard'].forEach((cb)=>cb(msg));
    }

    on(type,cb) {
        if(!this.cbs[type]) throw new Error(`incorrect event type: '${type}'`);
        this.cbs[type].push(cb);
    }

    log(...rest) {
        if(this.DEBUG === true) {
            console.log(this.id,":",...rest);
        }
    }
    sendMessage(msg) {
        msg.appname = this.id;
        msg.workspace = 'single';
        this.log(" sending message",msg);
        this.ws.send(JSON.stringify(msg));
    }

    subscribe(q,cb) {
        const id = "mid_"+Math.floor(Math.random()*10000);
        this.pending[id] = cb;
        this.ws.send(JSON.stringify({command:'subscribe',query:q,"messageId":id,
            // appname:this.id, workspace :'single'
        }));
    }

    updateQuery(id,q) {
        this.log(`updating the query ${id} with `,q);
        return POST_JSON("http://localhost:5151/api/updateQuery",{queryId:id,query:q});
    }

    query(q) {
        this.log('executing the query',q);
        return POST_JSON("http://localhost:5151/api/dbquery",{query:q}).then((answer)=>{
            // console.log("the query response is", answer);
            return answer;
        });
    }

    insert(doc) {
        doc.appname = this.id;
        doc.workspace = this.workspace;
        this.log('inserting',doc);
        return POST_JSON("http://localhost:5151/api/dbinsert",doc).then((answer)=>{
            // console.log("the insert response is", answer);
            return answer;
        });
    }

    update(doc) {
        doc.appname = this.id;
        doc.workspace = this.workspace;
        this.log('updating',doc);
        return POST_JSON("http://localhost:5151/api/dbupdate",doc).then((answer)=>{
            // console.log("the update response is", answer);
            return answer;
        });
    }

    delete(doc) {
        doc.appname = this.id;
        doc.workspace = this.workspace;
        this.log('deleting',doc);
        return POST_JSON("http://localhost:5151/api/dbdelete",doc).then((answer)=>{
            // console.log("the update response is", answer);
            return answer;
        });
    }


    makeLiveQuery(q) {
        var lq  = new LiveQuery(this,q);
        this.queries.push(lq);
        return lq;
    }
}
