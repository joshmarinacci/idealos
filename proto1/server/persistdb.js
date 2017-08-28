const Mongo = require('mongodb');
const util = require('util')

class LiveDB {
    constructor() {
	this.url = 'mongodb://localhost:27017/idealos';
        this._live_queries = [];
    }

    connect(callback) {
	const self = this;
	Mongo.connect(this.url, function(err, db) {
	    if (err !== null) {
		throw err;
	    }
	    console.log('Connected to persistent db');
	    self.db = db;
	    callback();
	});
    }

    importDocs(docs) {
	this.db.collection('docs').insertMany(docs, ((err, docsInserted) => {
	    docsInserted.ops.forEach((doc) => {
               this._live_queries.forEach((lq)=>{
                  if(lq.matches(doc)) {
                     lq.fireInsert([doc]);
                  }
               });
	    });
	}));
    }

    reset() {
	this.db.collection('docs').remove();
        this._live_queries = [];
    }

    insert(doc) {
        this.importDocs([doc]);
        return Promise.resolve(doc);
    }

    update(doc) {
	const self = this;
	return new Promise((resolve, reject) => {
  	    this.db.collection('docs').updateOne({"_id": doc._id}, {$set: doc}, function(err, r) {
	        if (err !== null) {
         	    reject(err);
	        } else {
		    self._live_queries.forEach((lq)=>{
		        if(lq.matches(doc)) lq.fireInsert([doc]);
		    });
		    resolve(doc);
	        }
	    });
	});
    }

    delete(doc) {
	return new Promise((resolve, reject) => {
 	    this.db.collection('docs').deleteOne({"_id": doc._id}, function(err, r) {
	        if (err !== null) {
	    	    reject(err);
	        } else {
		    this._live_queries.forEach((lq)=>{
		        if(lq.matches(doc)) lq.fireInsert([doc]);
		    });
		    resolve(doc);
	        }
	   });
	});
    }

    query(q) {
	return new Promise((resolve, reject) => {
  	    this.db.collection('docs').find(q).toArray(function(err, docs){
		if (err !== null) {
		    reject(err);
		} else {
	           resolve(docs);
		}
	    });
	});
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

}

class LiveQuery {
    constructor(q, db) {
	this.q = q;
        this.db = db;
        this.cbs = [];
        this.id = "id_"+Math.floor(Math.random()*10000);
        this.docs = [];
    }
    on(type,cb) {
        this.cbs.push(cb);
    }
    matches(doc) {
	const q = this.q;
	Object.keys(q).forEach(function(key) {
	    if (q[key] !== doc[key]) {
		return false;
	    }
	});
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
    updateQuery(q) {
        this.q = q;
        this.execute();
    }
    execute() {
        this.db.query(this.q).then((docs) => {
	    this.docs = docs;
            this.cbs.forEach((cb)=>cb(this.id,this.docs));
	});
    }
}
module.exports = {
    make: function() {
        return new LiveDB();
    }
};
