module.exports = [

    {
        type: 'system',
        id: 'CURRENT_CLIPBOARD_SELECTION',
        clips: []
    },


    {
        type: 'alarm',
        time: 60 * 8 + 30,
        enabled: false,
        name: 'wake up',
        repeat: ['none']
    },
    {
        type: 'alarm',
        time: 60 * 10,
        enabled: true,
        name: 'drink second cup of coffee',
        repeat: ['weekday']
    },
    {
        type: 'alarm',
        time: 60 * 14 + 15,
        enabled: false,
        name: 'afternoon coffee',
        repeat: ['weekday']
    },


    {
        type: 'alarm',
        time: 60 * 2 + 0,
        enabled: false,
        name: 'afternoon coffee',
        repeat: ['weekday']
    },


    {
        type: 'event',
        datetime: {
            day: 31,
            month: 8,
            year: 2017
        },
        title: 'birthday',
    },
    {
        type: 'event',
        datetime: {
            day: 15,
            month: 8,
            year: 2017,
            hour: 10,
            minute: 15
        },
        title: 'birthday',
    },


    {
        type:'artist',
        name:'And.',
    },
    {
        type:'album',
        artist:'And.',
        name:'Dans'
    },
    {
        type:'song',
        artist:'And.',
        album:'Dans',
        name:'Gigababoki',
        url:'https://joshondesign.com/p/music/And_-_Dans/And_-_01_-_Gigababoki.mp3'
    },
    {
        type:'song',
        artist:'And.',
        album:'Dans',
        name:'Hilton Orbital Hotel',
        url:'https://joshondesign.com/p/music/And_-_Dans/And_-_02_-_Hilton_Orbital_Hotel.mp3'
    },
    {
        type:'song',
        artist:'And.',
        album:'Dans',
        name:'Start Havok',
        url:'https://joshondesign.com/p/music/And_-_Dans/And_-_03_-_Start_Havok.mp3'
    },
    {
        type:'song',
        artist:'And.',
        album:'Dans',
        name:'Chicken Soup',
        url:'https://joshondesign.com/p/music/And_-_Dans/And_-_04_-_Chicken_Soup.mp3'
    },


    {
        type:'artist',
        name:'Binrpilot'
    },
    {
        type:'album',
        artist:'Binrpilot',
        name:'Defrag',
    },
    {
        type:'song',
        artist:'Binrpilot',
        album:'Defrag',
        name:'Goof',
        url:'https://joshondesign.com/p/music/Binrpilot_-_Defrag/Binrpilot_-_01_-_Goof.mp3'
    },
    {
        type:'song',
        artist:'Binrpilot',
        album:'Defrag',
        name:'Sandjorda',
        url:'https://joshondesign.com/p/music/Binrpilot_-_Defrag/Binrpilot_-_02_-_Sandjorda.mp3'
    },
    {
        type:'song',
        artist:'Binrpilot',
        album:'Defrag',
        name:'Widibf',
        url:'https://joshondesign.com/p/music/Binrpilot_-_Defrag/Binrpilot_-_03_-_Widibf.mp3'
    },
    {
        type:'song',
        artist:'Binrpilot',
        album:'Defrag',
        name:'Fuayfsilfm',
        url:'https://joshondesign.com/p/music/Binrpilot_-_Defrag/Binrpilot_-_04_-_Fuayfsilfm.mp3'
    },



    {
        id: 'contact_me',
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
        ],
        timezone:-8,
        avatar: "resource:avatar_01",
    },
    {
        id: 'contact_bill',
        type: 'contact',
        first: 'Bill',
        last: "Roberts",
        timezone:-9,
        avatar: "https://api.adorable.io/avatars/128/bill.png",
    },
    {
        id: 'contact_rob',
        type: 'contact',
        first: 'Rob',
        last: "Williams",
        pinned:true,
        timezone:5,
        avatar: "https://api.adorable.io/avatars/128/rob.png",
    },
    {
        id: 'contact_steve',
        type: 'contact',
        first: 'Steve',
        last: "Martin",
        pinned:true,
        timezone:0,
        avatar: "https://api.adorable.io/avatars/128/steve.png",
    },
    {
        id: 'contact_jen',
        type: 'contact',
        first: 'Jen',
        last: 'Marinacci',
        timezone:-5,
        avatar: "https://api.adorable.io/avatars/128/jen.png"
    },


    {type: "message", from: 'contact_me', to: 'contact_jen', text: "Hi Sweetie. I'm heading home", timestamp: 0,},
    {type: "message", from: 'contact_jen', to: 'contact_me', text: "Great. Can you pick up some milk?", timestamp: 1,},


    {
        type: 'note',
        title: 'notes from the meeting',
        body: 'this is a note',
    },
    {
        type: 'note',
        title: 'plan for the next year',
        body: 'this is another note',
    },
    {
        type: 'note',
        title: 'year for the plan',
        body: 'this is note another note. ha ha. nevermind.',
    },


    {
        type: 'notification',
        title: 'app launched',
        read: false
    },


    {
        type: 'todo',
        text: "get the milk",
        completed: false
    },

    {
        type: 'todo',
        text: "pick up the dry cleaning",
        completed: false
    },


    {type: 'app', title: 'Alarm', name: 'alarms'},
    {type: 'app', title: 'Music', name: 'musicplayer'},
    {type: 'app', title: 'Contacts', name: 'contacts'},
    {type: 'app', title: 'Todo List', name: 'todos'},
    {type: 'app', title: 'Web Browser', name: 'browser'},
    {type: 'app', title: 'Mail', name: 'email'},
    {type: 'app', title: 'Compose Mail', name: 'compose-email'},
    {type: 'app', title: 'Chat', name: 'chat'},
    {type: 'app', title: 'Debug', name: 'debug'},
    {type: 'app', title: 'Clipboard Viewer', name:'clipboard'},
    {type: 'app', title: 'Mandelbrot Viewer', name:'mandelbrot'},
    {type: 'app', title: 'Text Editor', name:'texteditor'},
    {type: 'app', title: 'Script Editor', name:'scripteditor'},


    // EMAILS
    {type: 'folder', name: 'root', id: 'id_root',},
    {type: 'folder', name: 'Inbox', id: 'id_inbox', folders: ['id_root']},
    {type: 'folder', name: 'Outbox', id: 'id_outbox', folders: ['id_root']},
    {type: 'folder', name: 'Drafts', id: 'id_drafts', folders: ['id_root']},
    {type: 'folder', name: 'Archive', id: 'id_archive', folders: ['id_root']},

    {
        type: 'email',
        from: 'foo@person.com',
        to: 'me',
        subject: "yo. 'sup?",
        folders: ['id_inbox'],
        read: true,
        content: {text: 'body'}
    },
    {
        type: 'email',
        from: 'bob@bob.com',
        to: 'me',
        subject: "your order is ready",
        folders: ['id_inbox'],
        read: false,
        content: {text: 'body'}
    },
    {
        type: 'email',
        from: 'mister man',
        to: 'other me',
        subject: "other cool stuff",
        folders: ['id_inbox'],
        read: true,
        content: {text: 'body'}
    },
    {type: 'email', from: 'me', folders: ['id_drafts'], subject: "foo bar baz", read: true, content: {text: 'body'}},
    {type: 'email', from: 'yo-dude', folders: ['id_archive'], subject: "old message", read: true, content: {text: 'body'}},


    {
        type: 'email',
        from: 'Nigerian Prince',
        subject: 'A fortune you have inherited',
        folders: ['id_inbox'],
        read: false,
        content: {
            mimeType: 'text/plain',
            text: "Dear sirs"
        }
    },


    {
        type: 'email',
        from: 'Nigerian Princess',
        subject: 'Yet another fortune!',
        folders: ['id_inbox'],
        read: true,
        content: {
            mimeType: 'text/plain',
            text: "Dear sirs"
        }
    },


    {
        type: 'email',
        from: 'United',
        subject: 'Flight update',
        folders: ['id_travel'],
        read: true,
        content: {
            mimeType: 'text/plain',
            text: "Dear sirs"
        }
    },


    {
        type: 'clip',
        text: 'Some cool text I might use later',
        pinned: false,
    },
    {
        type: 'clip',
        text: 'pharmacy ID number',
        pinned: true,
    },
    {
        type: 'clip',
        text: 'Some other text for later',
        pinned: false,
    },


    {
        type:'image',
        format:'png',
        tags:['avatar'],
        url:'resource:avatars/if_users-2_984102.png',
        title:'if_users-2_984102',
        id:'avatar_01'
    },
    {
        type:'image',
        format:'png',
        tags:['avatar'],
        url:'resource:avatars/if_users-12_984125.png',
        title:'if_users-12_984125',
        id:'avatar_02'
    },
    {
        type:'image',
        format:'png',
        tags:['avatar'],
        url:'resource:avatars/if_users-13_984120.png',
        title:'if_users-13_984120',
        id:'avatar_03'
    },
    {
        type:'image',
        format:'png',
        tags:['avatar'],
        url:'resource:avatars/if_users-16_984113-1.png',
        title:'if_users-16_984113-1',
        id:'avatar_04'
    },


    {
        type:'script',
        language:'javascript',
        trigger: { type:'email' },
        active:true,
        code: `(function myfun(event) {
            console.log("got an email");
        })`,
    },

    {
        type:'script',
        language:'javascript',
        trigger: { type:'email'},
        active:true,
        code: `(function myfun(event) {
            var email = event.document;
            if(email.subject === 'play') {
                console.log('we need to play a song');
                event.database.sendMessage({
                    type:'audio',
                    target:'system',
                    command:'toggle-play',
                });
            }
        })`
    }
];