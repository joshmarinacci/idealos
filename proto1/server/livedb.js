const mingo = require('mingo');

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
    query(q) {
        if(!q) q = {};
        let mq = new mingo.Query(q);
        var res = mq.find(this._docs);
        return Promise.resolve(res.all());
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

function doQueryObjectMatch(doc, key, set, settings) {
    let docval = doc[key];
    if(set.prefix) {
        console.log("doing a prefix search on field", key);
        var prefix = set.prefix;
        if(set.caseInsensitive === true) {
            prefix = prefix.toLowerCase();
            docval = docval.toLowerCase();
        }
        if(docval.indexOf(prefix) >= 0) {
            console.log("matches prefix");
            return true;
        }
    }
}

const CONSTS = {
    AND:'and',
    OR:'or'
};

function normalizeSettings(settings) {
    if(!settings.combine) settings.combine = CONSTS.AND;
    settings.combine = settings.combine.toLowerCase();
    return settings;
}

function executeRawQuery(docs, query, settings) {
    //normalize
    settings = normalizeSettings(settings);

    const docs2 = docs.filter((doc)=>{
        var keys = Object.keys(query);
        for(let i=0; i<keys.length; i++) {
            let key = keys[i];
            if(typeof doc[key] === 'undefined') return false;

            let docval = doc[key];

            if(typeof query[key] === 'object') {
                let queryspec = query[key];
                return doQueryObjectMatch(doc, key, queryspec, settings);
            }

            let queryval = query[key];



            if(settings && settings.caseInsensitive === true) {
                docval = docval.toString().toLowerCase();
                queryval = queryval.toString().toLowerCase();
                if (docval !== queryval) return false;
            } else {
                if (docval !== queryval) return false;
            }
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
