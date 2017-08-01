class LiveQuery {
    constructor(desc, db) {
        this.db = db;
        this.desc = desc;
        this.cbs = [];
        this.filter = (d) => {
            var valid = true;
            Object.keys(this.desc).forEach((key) => {
                if(this.desc[key] !== d[key]) valid = false;
            });
            return valid;
        }
    }
    updateQuery(desc) {
        Object.keys(desc).forEach((key)=>{
            this.desc[key] = desc[key];
            //remove keys
            if(!desc[key] || desc[key].length === 0) delete this.desc[key];
        });
        this.update(this.db.docs);
    }
    on(type,cb) {
        this.cbs.push(cb);
    }
    matches(doc) {
        return this.filter(doc);
    }
    update(data) {
        var d2 = data.filter(this.filter);
        this.cbs.forEach((cb)=>cb(d2));
    }
    execute() {
        return this.db.docs.filter(this.filter);
    }
}
class LiveDatabase {
    constructor() {
        this.docs = [];
        this.queries = [];
    }
    makeLiveQuery(desc) {
        var q = new LiveQuery(desc,this);
        this.queries.push(q);
        return q;
    }
    insert(doc) {
        this.docs.push(doc);
        this.queries.forEach((q)=> {
            if(q.matches(doc)) {
                q.update(this.docs);
            }
        })
    }
}



export const DB = new LiveDatabase();