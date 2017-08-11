const test = require('tape');
const DB = require('./livedb').make();

const contacts = [
    {
        type: 'contact',
        first: "Josh",
        last: "Marinacci",
        address: [
            {
                street: "50 Nice Street",
                city: "Awesomeville",
                state: "TA",
                zip: "66666"
            }
        ]
    },
    {
        type: 'contact',
        first: 'Bill',
        last: "Roberts",
    },
    {
        type: 'contact',
        first: 'Rob',
        last: "Williams",
    },
    {
        type: 'contact',
        first: 'Steve',
        last: "Martin",
    },

    {
        type: 'contact',
        first: 'Bill',
        last: 'Sanders',
    },

    {
        type: 'contact',
        first: 'Sally',
        last: 'Salamander'
    }
];

DB.importDocs(contacts);

test('query all docs', (t) => {
    DB.query().then((docs) => {
        t.equals(docs.length, 6);
        t.end();
    });
});

test('query first name is Josh', (t) => {
    DB.query({first: 'Josh'}).then((docs) => {
        t.equals(docs.length, 1);
        t.end();
    });
});


test('query first name is josh, case insensitive', (t) => {
    DB.query({first: /josh/i}).then((docs) => {
        t.equals(docs.length, 1);
        t.end();
    });
});

test('search field with a prefix', (t) => {
    DB.query({first: /^J/}).then((docs) => {
        t.equals(docs.length, 1);
        t.end();
    });
});

test('search field with a prefix, case insensitive', (t) => {
    DB.query({first: /^J/i}).then((docs) => {
        t.equals(docs.length, 1);
        t.end();
    });
});

test('search two fields with a prefix, case insensitive, OR', (t) => {
    DB.query({$or: [{first: /^s/i}, {last: /^s/i}]}).then((docs) => {
        t.equals(docs.length, 3);
        t.end();
    });
});


test('search two fields with a prefix, case insensitive, AND', (t) => {
    DB.query({$and: [{first: /^s/i}, {last: /^s/i}]}).then((docs) => {
        t.equals(docs.length, 1);
        t.end();
    });
});


const music = [
    {
        type:'artist',
        name:'Erasure'
    },
    {
        type:'artist',
        name:'Depeche Mode'
    },
    {
        type:'artist',
        name:'Cars'
    },
    {
        type:'artist',
        artist:'Alphaville',
    },

    {
        type:'album',
        artist:'Erasure',
        name:'Wild'
    },
    {
        type:'album',
        artist:'Erasure',
        name:'The Innocents'
    },
    {
        type:'album',
        artist:'Depeche Mode',
        name:'Some Great Reward'
    },
    {
        type:'album',
        artist:'Depeche Mode',
        name:'Violator'
    },
    {
        type:'album',
        artist:'Depeche Mode',
        name:'Songs of Faith and Devotion'
    },
    {
        type:'song',
        artist:'Depeche Mode',
        album:'Violator',
        name:'In Your Eyes'
    },
    {
        type:'album',
        artist:'Alphaville',
        name:'Best Of',
    },
    {
        type:'song',
        artist:'Alphaville',
        name:'Forever Young',
        url:'https://joshondesign.com/p/MaiTai/b1/Samples/Forever_Young.mp3'
    },

];


test('search three music fields', (t) => {
    DB.reset();
    DB.importDocs(music);

    //search for artist where name is erasure
    DB.query({$or:[{ type: 'artist', name: 'Erasure'}]}).then( docs => t.equals(docs.length,1))

        //search for artist is erasure or album where artist is erasure
        .then(()=>DB.query({$or:[ {type:'artist', name:'Erasure'}, {type:'album', artist:'Erasure'}]}))
        .then((docs)=>t.equals(docs.length,3))


        //search albums where name or artist contains 'o'
        .then(()=>DB.query({$or:[
            {type:'album', name:{ $regex:'o'}},
            {type:'album', artist:{ $regex:'o'}}
        ]}))
        .then(docs=>t.equals(docs.length,4))

        //search albums where name or artist contains 'o', alternate form
        .then(()=>DB.query({
            type:'album',
            $or:[ {name:{ $regex:'o'}}, {artist:{ $regex:'o'}}
        ]}))
        .then(docs=>t.equals(docs.length,4))


        .then(()=>t.end())
    ;
});
