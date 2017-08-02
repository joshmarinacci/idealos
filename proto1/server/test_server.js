const test = require('tape');
const DB = require('./livedb').make({path:"tempdb.json"});

test("mass add documents then query alarms", (t)=> {
    DB.importDocs([
        {
            type: 'alarm',
            time: 8 * 60 + 30, //8:30
            enabled: true,
            name: 'wake up early, not!',
            repeat: []
        },
        {
            type: 'email',
            from: 'Nigerian Prince',
            subject: 'A fortune you have inherited',
            content: {
                mimeType: 'text/plain',
                body: "Dear sirs"
            }
        }
    ]);
    DB.query({})
        .then((docs) => {
            t.equals(docs.length, 2);
        })
        .then(() => {
            return DB.query({type: 'alarm'});
        })
        .then((docs) => {
            t.equals(docs.length, 1);
            t.equals(docs[0].type,'alarm');
        })
        .then(()=>{
            t.end();
        })
    ;
});

