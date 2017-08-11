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
        type:'contact',
        first:'Bill',
        last:'Sanders',
    },

    {
        type:'contact',
        first:'Sally',
        last:'Salamander'
    }
];

DB.importDocs(contacts);

test('query all docs', (t) => {
    DB.query({
        query: {},
        settings: {}
    }).then((docs) => {
        t.equals(docs.length, 6);
        t.end();
    })
});

test('query first name is Josh', (t) => {
    DB.query({
        query: {first: 'Josh'},
        settings: {}
    }).then((docs) => {
        t.equals(docs.length, 1);
        t.end();
    })
});

test('query first name is josh, case insensitive', (t) => {
    DB.query({
        query: {first: 'josh'},
        settings: {caseInsensitive: true}
    }).then((docs) => {
        t.equals(docs.length, 1);
        t.end();
    })
});

test('search field with a prefix', (t) => {
    DB.query({
        query: {
            first: {prefix: 'J', caseInsensitive: false},
        },
        settings: {}
    }).then((docs) => {
        t.equals(docs.length, 1);
        t.end();
    })
});

test('search field with a prefix, case insensitive', (t) => {
    DB.query({
        query: {
            first: {prefix: 'j', caseInsensitive: true},
        },
        settings: {
        }
    }).then((docs) => {
        t.equals(docs.length, 1);
        t.end();
    })
});

test('search two fields with a prefix, case insensitive, OR', (t) => {
    DB.query({
        query: {
            first: {prefix: 's', caseInsensitive: true},
            last: {prefix: 's', caseInsensitive: true}
        },
        settings: {
            combine: 'or'
        }
    }).then((docs) => {
        t.equals(docs.length, 3);
        t.end();
    })
});


test('search two fields with a prefix, case insensitive, AND', (t) => {
    DB.query({
        query: {
            first: {prefix: 's', caseInsensitive: true},
            last: {prefix: 's', caseInsensitive: true}
        },
        settings: {
            combine: 'and'
        }
    }).then((docs) => {
        t.equals(docs.length, 1);
        t.end();
    })
});