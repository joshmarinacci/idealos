class LiveDB {
    constructor() {
        console.log("making a database");
        this._docs = [];
        this._live_queries = [];
    }

    importDocs(docs) {
        docs.forEach((doc)=>{
            this._docs.push(doc);
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
    query(q) {
        if(!q) return Promise.resolve(this._docs);
        if(Object.keys(q).length === 0) return Promise.resolve(this._docs);


        if(q.type) {
            console.log("doing the type",q.type);
            return Promise.resolve(this._docs.filter((d)=>d.type === q.type));
        }

        console.log("can't do query",q);
    }

    makeLiveQuery(q) {
        let lq = new LiveQuery(q);
        this._live_queries.push(lq);
        return lq;
    }
}

class LiveQuery {
    constructor(q) {
        this.query = q;
        this.cbs = [];
        this.id = "id_"+Math.floor(Math.random()*10000);
    }
    on(type,cb) {
        this.cbs.push(cb);
    }
    matches(doc) {
        if(doc.type === this.query.type) return true;
        return false;
    }
    fireInsert(docs) {
        this.cbs.forEach((cb)=>cb(this.id,docs));
    }
}
module.exports = {
    make: function() {
        return new LiveDB();
    }
}