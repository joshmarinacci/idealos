class LiveDB {
    constructor() {
        console.log("making a database");
        this._docs = [];
        this._live_queries = [];
    }

    generateID() {
        return "did_" + Math.floor(Math.random() * 10000);
    }


    importDocs(docs) {
        docs.forEach((doc)=>{
            this._docs.push(doc);
            if(!doc.id) doc.id = this.generateID();
            this._live_queries.forEach((lq)=>{
                console.log("checking for a match",doc, lq.query);
                if(lq.matches(doc)) {
                    console.log("matched",lq.query)
                    lq.fireInsert([doc]);
                }
            })
        });
    }

    insert(doc) {
        this.importDocs([doc]);
        return Promise.resolve();
    }

    update(doc) {
        const old_n = this._docs.findIndex((d)=>d.id == doc.id);
        const old_doc = this._docs[old_n];

        this._docs.splice(old_n,1,doc);
        this._live_queries.forEach((lq)=>{
            if(lq.matches(old_doc)) lq.fireRemove([old_doc]);
        });
        this._live_queries.forEach((lq)=>{
            if(lq.matches(doc)) lq.fireInsert([doc]);
        });
        return Promise.resolve(doc);
    }

    delete(doc) {
        const old_n = this._docs.findIndex((d)=>d.id == doc.id);
        this._docs.splice(old_n,1);
        this._live_queries.forEach((lq)=>{
            if(lq.matches(doc)) lq.fireDelete([doc]);
        });
        return Promise.resolve(doc);
    }
    query(stuff) {
        const q = stuff.query;
        const settings = stuff.settings;
        if(!q) return Promise.resolve(this._docs);
        if(Object.keys(q).length === 0) return Promise.resolve(this._docs);


        if(q.type) {
            var result = executeRawQuery(this._docs, q, settings);
            return Promise.resolve(result);
        }

        console.log("can't do query",q);
    }

    makeLiveQuery(q,settings) {
        let lq = new LiveQuery(q,settings,this);
        this._live_queries.push(lq);
        return lq;
    }

    updateLiveQuery(queryId,query) {
        let q = this._live_queries.find((q)=>q.id === queryId);
        q.updateQuery(query);
    }

}

class LiveQuery {
    constructor(q,settings,db) {
        this.query = q;
        this.settings = settings;
        this.db = db;
        this.cbs = [];
        this.id = "id_"+Math.floor(Math.random()*10000);
        this.docs = [];
    }
    on(type,cb) {
        this.cbs.push(cb);
    }
    matches(doc) {
        var keys = Object.keys(this.query)
        for(let i=0; i<keys.length; i++) {
            let key = keys[i];
            if(typeof doc[key] === 'undefined') return false;
            if(doc[key] !== this.query[key]) return false;
        }
        return true;
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
    updateQuery(query) {
        console.log("updating the live query",this.id,this.query,query);

        Object.keys(query).forEach((key)=>{
            this.query[key] = query[key];
            //remove keys
            // if(!desc[key] || desc[key].length === 0) delete this.desc[key];
        });
        this.execute();
    }
    execute() {
        this.docs = executeRawQuery(this.db._docs, this.query, this.settings);
        this.cbs.forEach((cb)=>cb(this.id,this.docs));
    }
}
module.exports = {
    make: function() {
        return new LiveDB();
    }
}


function executeRawQuery(docs, query, settings) {
    const docs2 = docs.filter((doc)=>{
        var keys = Object.keys(query);
        for(let i=0; i<keys.length; i++) {
            let key = keys[i];
            if(typeof doc[key] === 'undefined') return false;
            if(doc[key] !== query[key]) return false;
        }
        return true;
    });

    if(settings && settings.order) {
        var fkey = Object.keys(settings.order)[0];
        docs2.sort((a, b) => {
            const av = a[fkey];
            const bv = b[fkey];
            if(av < bv) return -1;
            if(av > bv) return +1;
            return 0;
        });
        console.log(docs2.map((t)=>t[fkey]).join(" \n"));
    }
    return docs2
}
