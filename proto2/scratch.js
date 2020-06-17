
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


