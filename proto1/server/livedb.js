class LiveDB {
    constructor() {
        console.log("making a database");
        this._docs = [];
    }

    importDocs(docs) {
        docs.forEach((doc)=>this._docs.push(doc));
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
}
module.exports = {
    make: function() {
        return new LiveDB();
    }
}