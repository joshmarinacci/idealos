const mingo = require('mingo');


class LiveDB {
    constructor() {
        this._docs = [];
        this._live_queries = [];
    }

    generateID() {
        return "did_" + Math.floor(Math.random() * 10000);
    }


    importDocs(docs) {
        docs.forEach((doc)=>{
            if(!doc.id) doc.id = this.generateID();
            // console.log('importing',doc);
            this._docs.push(doc);
            this._live_queries.forEach((lq)=>{
                if(lq.matches(doc)) {
                    lq.fireInsert([doc]);
                }
            });
            this.checkScripts(doc,'INSERT');
        });
    }

    reset() {
        this._docs = [];
        this._live_queries = [];
    }

    insert(doc) {
        this.importDocs([doc]);
        return Promise.resolve(doc);
    }

    update(doc) {
        const old_n = this._docs.findIndex((d)=>d.id === doc.id);
        const old_doc = this._docs[old_n];

        this._docs.splice(old_n,1,doc);
        this._live_queries.forEach((lq)=>{
            if(lq.matches(old_doc)) lq.fireRemove([old_doc]);
        });
        this._live_queries.forEach((lq)=>{
            if(lq.matches(doc)) lq.fireInsert([doc]);
        });

        this.checkScripts(doc,'UPDATE');

        return Promise.resolve(doc);
    }

    delete(doc) {
        const old_n = this._docs.findIndex((d)=>d.id === doc.id);
        this._docs.splice(old_n,1);
        this._live_queries.forEach((lq)=>{
            if(lq.matches(doc)) lq.fireDelete([doc]);
        });
        this.checkScripts(doc,'DELETE');
        return Promise.resolve(doc);
    }
    query(q) {
        let mq = new mingo.Query(q||{});
        return Promise.resolve(mq.find(this._docs).all());
    }

    makeLiveQuery(q) {
        let lq = new LiveQuery(q,this);
        this._live_queries.push(lq);
        return lq;
    }

    updateLiveQuery(queryId,q) {
        let lq = this._live_queries.find((q)=>q.id === queryId);
        lq.updateQuery(q);
    }

    checkScripts(doc,mode) {
        this._docs
            .filter((d)=> d.type === 'script')
            .forEach((scr)=> this.evalScript(scr,doc,mode))
    }
    evalScript(scr,doc,mode) {
        if(!scr.active) return;
        if(scr.language !== 'javascript') return;


        let mq = new mingo.Query(scr.trigger);
        const matched = mq.find([doc]).all();
        if(matched.length <= 0) return;
        console.log("found a script to trigger",scr);

        console.log('evaluating script ',scr.code);
        console.log('on document',doc);

        const event = {
            mode: mode,
            document: doc,
            database: this
        };

        try {
            //the actual eval
            eval(scr.code)(event);
        } catch(e) {
            console.log("error",e);
        }

    }
}

class LiveQuery {
    constructor(q,db) {
        let mq = new mingo.Query(q||{});
        this.query = mq;
        this.db = db;
        this.cbs = [];
        this.id = "id_"+Math.floor(Math.random()*10000);
        this.docs = [];
    }
    on(type,cb) {
        this.cbs.push(cb);
    }
    matches(doc) {
        return this.query.test(doc);
    }
    fireInsert(docs) {
        this.execute();
    }
    fireRemove(docs) {
        this.execute();
    }
    fireDelete(docs) {
        this.execute();
    }
    updateQuery(q) {
        this.query = new mingo.Query(q||{});
        this.execute();
    }
    execute() {
        this.docs = this.query.find(this.db._docs).all();
        this.cbs.forEach((cb)=>cb(this.id,this.docs));
    }
}
module.exports = {
    make: function() {
        return new LiveDB();
    }
};
