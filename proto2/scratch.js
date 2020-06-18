
/*
# email composer mockup


#idealos

* grid
* hbox
* button.action <= email_send_action
* button.action <= attach_file_action
* button.action <= toggle_text_formatting_action
* to row
* `to_label.value <= “To:”`
* `to_input.value <= draft.recipients`
    ``` javascript
const to_input = {
	type: 'tag_input'
	tag_query: [all_contacts].[email_address]*
}
```
* `to_add_button <= show_dropdown(contact_search_panel)`
* from row
* select
* `query <= email_accounts.senders.to_string`


    ``` javascript
const layout = {
	type: 'grid',
	children: [
		{
			type:'hbox'
			children: [
				{
					type:'button',
					label:'no label',
					icon: 'system.icons.mail.send_'
				}
			]
		}
	]
}
```

*/

const system = {
    icons: {
        mail: {
            send_action:'send.png',
            attach_action:'attach.png'
        }
    },
    translations: {
        mail: {
            send_action:'Send',
            attach_action:'Attach',
            to_field:'To:',
        }
    }
}


const email_accounts = [
    {
        provider:'Google',
        description:'Personal',
        name:'Josh Marinacci',
        address:'joshua@marinacci.org',
    },
    {
        provider:'Google',
        description:'Work',
        name:'Josh Marinacci',
        address:'jmarinacci@mozilla.com',
    }
]

const contacts = [
    {
        first: "Josh",
        last: "Marinacci",
        emails: [
            {
                type:'email',
                tag:'personal',
                address:'joshua@marinacci.org',
            },
            {
                type:'email',
                tag:'work',
                address:'jmarinacci@mozilla.com',
            }
        ]
    }
]


const draft = {
    to_field: [
        {
            type:'email_address',
            address:'foo@bar.com',
            name:'Mr Foo'
        },
        {
            type:'email_address',
            address:'baz@bar.com',
            name:'Mrs Baz',
        }
    ],
    subject_field: {
        type:'string',
        value:'',
    }
}

const email_formatter = (email) => m.name + " " + m.address

const none = (v) => v

// make a virtual property on email address for name, that uses first plus last name

const app = {
    send_mail_action: (doc) => {
        console.log("sending the mail",doc)
    },
    open_attachment_panel_action: (doc) => {
        console.log("opening an attachment panel")
    },
    compose_new_email_action: (viewer_doc) => {
        let doc = db.make_draft_email()
        open_new_window({
            doc,
            layout,
            type:'app'
        })
    },
}

const layout = {
    type:'grid',
    children: [
        {
            type:'hbox',
            children: [
                {
                    type:'button',
                    label:system.translations.mail.send_action,
                    icon: system.icons.mail.send_action,
                    action: app.send_mail_action,
                },
                {
                    type:'spacer'
                },
                {
                    type:'button',
                    label:system.translations.mail.attach_action,
                    icon: system.icons.mail.attach_action,
                    action: app.open_attachment_panel_action,
                },
            ]
        },
        {
            type:'hbox',
            children: [
                {
                    type:'label',
                    label:system.translations.mail.to_field,
                },
                {
                    type:'tag_input',
                    query: draft.to_field,
                    formatter: email_formatter,
                }
            ]
        },
        {
            type:'hbox',
            children: [
                {
                    type:'label',
                    label:system.translations.mail.subject_field,
                },
                {
                    type:'text_input',
                    query: draft.subject_field,
                    formatter: none,
                }
            ]
        }
    ]
}


/*

selection is a list of albums
songs are a collection of tracks within albums, joined.

selection
    albums
        songs


selected_albums <= select * from selection,albums where selection.album = albums.id
selected_songs <= select * from selected_albums,songs where album.id = songs.album
return selected_songs.songs


albums
    songs

albums.id





Data driven development

Selection {
    albums: [ Album(reference) ]
}

Artist {
    title: String
}

Album {
    title: String,
    track_count: Integer,
    disc_count: Integer,
    artist: Artist,
}

Track {
    ?track_number: Integer,  dummy: ()=>new Integer(rand_int_range(1,20)), ui: {type:number, columns:2}
    ?artist: Artist, embedded or reference, ui: {type:dropdown_search},
    ?title: String, len 4k, dummy: ()=>new String(words.pick(4)), ui: { type:'text', rows:'1' }
    ?album: Album, embedded or reference, ui: {type: dropdown_search},
    ?composer: String, len unlimited, dummy: ()=>new String(names.pick(8)), ui: { type:'text' },
    ?year: Year, ui: { type:'year-picker'},
    ?rating: Rating, dummy: None,
    ?file: Blob, blob or file-reference, dummy: None,
    ?duration: Seconds, dummy: ()=>new Seconds(rand_int_range(50,6*60))
}

Rating := Integer, range(0,5), dummy: None, ui: { type:'star-picker'}
Seconds := Float, range(standard)
Year := Integer, range(-10000,10000), dummy: new Integer(rand_int_range(1990,2020)),

let beatles = new Artist({
    title:'Beatles',
    })
let yellow = new Album({
    title:new String("Yellow Submarine"),
    track_count: new Integer(20),
    disc_count: new Integer(1),
})

let song1 = create(Track,{
    track_number: 3,
    title: new String("All You Need Is Love")
    artist: beatles,
    album: yellow,
    })

let sel = new Selection({albums:[yellow]})

let selected_albums = make_live_query(Albums).where_in(sel.attr('albums'))
let songs = make_live_query(Track).where_attr('album').in(selected_albums)

let song2 = create_dummy(Track)  makes a completely randomly generated track
let song3 = create_dummy(Track, {album:yellow}) makes random track, but uses specified album

let ui1 = create_ui(Track) // makes a vbox with one hbox for each property in alphabetical order


features
* constructor will validate the inputs. If one is missing or the wrong type it will throw an exception automatically
* generate an object with fake data automatically using the types with refinements
* making a field optional forces you to use an Option to access it
* make live queries that you can observe to get updates when any dep changes
* generate a UI for editing a particular object

*/



