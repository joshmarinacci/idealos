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


// create a live query for alarm docs
// test that query works when inserting a new alarm doc

test('live alarm query', (t)=>{
    DB.importDocs([
        {type:'alarm',time:1},
        {type:'alarm',time:2},
    ]);

    let live_query = DB.makeLiveQuery({type:'alarm'});
    live_query.on('insert',(docs)=>{
        console.log("docs inserted",docs);
        t.equals(docs.length,1);
        t.equals(docs[0].type,'alarm');
        t.equals(docs[0].time,3);
        t.end();
    });

    DB.importDocs([
        {type:'alarm',time:3},
    ]);

});