import {GET_JSON, POST_JSON} from "./NetUtils";

class LiveQuery {
    constructor(db,q) {
        this.cbs = {
            update:[],
            execute:[]
        };
        this.db = db;
        this.query = q;
        console.log('created a live query');

        this.db.subscribe(q,(docs)=>{
            console.log('subscription got some docs',docs);
            if(docs.type==='querycreated') {
                this.id = docs.queryId;
            }
        })
    }

    on(type,cb) {
        this.cbs[type].push(cb);
    }

    update(msg) {
        console.log("live query", this.id,"got an update message",msg.docs);
        msg.docs.forEach((d)=>{
            this.data.push(d);
        });
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
    constructor() {
        this.cbs = {
            connect:[]
        };
        this.pending = [];
        this.queries = [];
    }
    connect() {
        function log(...rest) {
            console.log(...rest);
        };
        console.log("connecting");
        this.ws = new WebSocket('ws://localhost:5150');
        this.ws.onerror = () => log('WebSocket error');
        this.ws.onopen = () => {
            log('WebSocket connection established');
            this.cbs.connect.forEach((cb)=>cb("connected"));
        };
        this.ws.onclose = () => log('WebSocket connection closed');
        this.ws.onmessage =  (event) =>  this.dispatchMessage(JSON.parse(event.data));

        GET_JSON("http://localhost:5151/api/info").then((answer) => {
            console.log("connection to server said",answer);
        });
    }

    dispatchMessage(msg) {
        console.log("message arrived",msg);
        if(msg.type==='queryupdate') {
            console.log('live query updated',msg.queryId);
            this.queries.forEach((q)=>{
                if(q.id === msg.queryId) {
                    console.log("query match");
                    q.update(msg);
                }
            })

        }
        if(msg.type === 'querycreated') {
            console.log("query was created with id",msg.queryId, msg.messageId);
            if(this.pending[msg.messageId]) {
                this.pending[msg.messageId](msg);
                delete this.pending[msg.messageId];
            }
        }
    }

    on(type,cb) {
        this.cbs[type].push(cb);
    }

    subscribe(q,cb) {
        const id = "mid_"+Math.floor(Math.random()*10000);
        this.pending[id] = cb;
        this.ws.send(JSON.stringify({command:'subscribe',query:q,"messageId":id}));
    }

    query(q) {
        return POST_JSON("http://localhost:5151/api/dbquery",q).then((answer)=>{
            console.log("the query response is", answer);
            return answer;
        });
    }

    insert(doc) {
        return POST_JSON("http://localhost:5151/api/dbinsert",doc).then((answer)=>{
            console.log("the insert response is", answer);
            return answer;
        });
    }


    makeLiveQuery(q) {
        var lq  = new LiveQuery(this,q);
        this.queries.push(lq);
        return lq;
    }
}
