# idealos
mockups of an ideal desktop operating system / environment


to run it:

* checkout the code
* cd to proto1 dir:  `cd idealos/proto1`
* install deps:   `npm install`
* run server in background:  `npm run server &`
* run client in dev mode: `npm run start`

The browser will open and start the mockup desktop operating system.  All data is in memory and will be reset when the server is restarted.




-------------

email client


```
folder_list_query = query all docs where type is mail_folder, order by name
folder_list_view is view, bound to folder_list_query
mail_list_query = query all docs where type is email, folder is in folder_list_view.selected, order by date
mail_list_view is view, bound to mail_list_query
mail_list_view.title <= mail_list_query.title
mail_item_view is view, query all docs where id = bound to mail_list_view.selected.id
mail_item_view is vbox
	hbox
		label: to
		label: <= model.to
	hbox
		label: from
		label: <= model.from
	hbox
		label: subject
		label: <= model.subject
	scrollbox
		htmlview: <= model.content
main_view is vbox
	hbox
		button: new edit_view
	hbox
		scrollbox
			folder_list_view
		scrollbox
			mail_list_view
		scrollbox
			mail_item_view

edit_view is vbox
	hbox
		label: to
		tagbox <= model.to, query all docs type==contact
	hbox
		label: subject
		textline <= model.subject
	scrollbox
		richtextview: <= model.content
```

# Contacts List

contacts_list is query all docs type == contact

```
contacts_view is hbox
	vbox
		searchbox <= app.filter
		list <= contacts_list filterby app.filter
	vbox
		hbox
			label: selected.first
			label: selected.last
		hbox
			label: selected.company
		vbox
			selected.phones => map (contact)
				hbox
					label: phone.type
					label: phone.number
		vbox
			selected.addresses => map (address)
				hbox
					label: address.type
					label: address.street
				hbox
					label: address.city
					label: address.state
					label: address.zip

```

# MP3 player

mp3_artist_names <= query all docs type === song, unique by artist_id, artist_id
mp3_artist_list  <= query all docs type === song_artist where id in mp3_artist_names
mp3_artist_view  <= listview, model <= mp3_artist_list
mp3_albums_list  <= query all docs song_album where id in (all where type === song, unique by album_id) where artist == mp3_artist_view.selected.id
mp3_albums_view  .model <= mp3_albums_list
mp3_songs_list   <= query all docs where type == song, album == mp3_albums_view.selected.id

hbox
	hbox
		prev
		play:  playing <= mp3_songs_list.selected, player.play(playing)
		next
	vbox
		label: playing.song
		label: (query all artist where (id == playing.artist_id)).name
		label: (query all album where (id == playing.album_id)).name
		

# Todo List

items = query all docs type == todo_item, ordered by position	
vbox
	hbox
		push_button: insert new type==todo_item
	scroll listview
		template(item)
			check_button <= item.completed
			text_line    <= item.title
			text_area    <= item.description
			tag_box      <= item.tags, query all docs type == todo_item, union item.tags, unique by tag,

# alarms app
items = query all docs type == alarm, ordered by time
		
		

----------


a conceptually minimal operating system

https://news.ycombinator.com/item?id=10222934
http://interim.mntmn.com


I can be rational and work on a smaller project that is more likely to be completed and see use, 
or I can go crazy and choose to build something so ludicrously ambitious that only a complete fool 
would pursue it.  I have chosen the fool’s path.

To build a new desktop OS from scratch with the full rich ecosystem of Mac or Windows is impossible. 
It simply can’t be created without taking further decades and thousands of man years of work. However, 
I believe it is quite possible for one person to develop an experimental desktop operating system with
modern ideas and a completely open platform, provided we make a few concessions.

A modern desktop OS build on the Linux core, but ditching: 
* X
* all existing shells
* all existing applications
* and the user visible filesystem

components:
* database filesystem and query editor with instant access (obviously)
* compositing window manager with hackable transitions and tabs
* git based app distribution
* set of core desktop apps
* documented APIs to hack the system and build your own apps
* human interface guidelines for proper design
* component API for apps
* system API for privileged tasks
* support standard mouse, keyboard, gamepad as input
* supports Raspberry Pi 2 (ARM) and VirtualBox (x86)
* minimal GUI toolkit and scenegraph
* a new kind of command line shell / query engine

apps
* plain editor for text and code
* WYSIWYG editor for simple styled text
* music player/organizer (think iTunes when it was good. mp3 only)
* image viewer: PNG & JPEG only
* email app: plain text only, can send and receive via IMAP & SMTP (new impls from scratch)
* PIM
    * address book, optionally syncs with google contacts
    * notes app
    * todo list app
    * calendaring app, optionally syncs w/ google calendar
    * reminders app
* CPU based fractal app
* live editor shader toy
* simple video player (h264 only)
* one screensaver
* system settings editor
* XMPP chat app
* solitaire

features:
* resolution switching on the fly
* everything is hackable from any language with API calls
* everything is scriptable with a visual pipeline
* global user defined keymaps
* secure by default: apps always run as dummy users. optional sandboxing with docker.
* system wide AA fonts

License:
* all source code. open source (BSD?)
* all docs and other assets: creative commons
* buildable with a single command from github.
* all fonts, icons, etc. under appropriate open licenses

It will not feature:
* an integrated app store, music store, amazon store, or other paid service of any kind
* compatibility with existing X based applications
* compatibility with existing headless apps or shells (/w some exceptions)
* an office suite
* case sensitivity
* a webbrowser (this is the big one)
* themeable GUI toolkit
* new audio or video codecs (we will use mp3 and h264)
* backup software
* a graphical app store (maybe)
* network utilities (web server, firewall, file sharing, etc. just use underlying linux for that)
* support for existing distros, this will be usable on core-debian/raspbian and that’s it
* support for scanners, printers, webcams, iPads, various other accessories.
* laptop features like hibernate, suspend, etc.
* support for native hardware (other than the raspberry pi)
* virtual desktops (though you’ll be able to write your own)
* a console emulator (holy carp no!)
* reversi (suck it, Reversi!)

all development out in the open, on github, with issues, with a roadmap, available to chat online anytime, available to take requests for certain features.



UglyOS. It won’t be pretty, but it will be designed well.


------------

implementation plan.  start with database and datatypes and services. this can be fully unit tested and headless.


database has objects. each object has an id and fields.  certain fields are common and used by the applications.
database queries are live. you can subscribe to them for updates.

db.filter({type:’email’, location:’inbox’}).on(‘add’,function(element){}).on(‘remove’,function(element) {});
to marke an email as deleted
db.update(email.id,{ location:’trash’});

build db with local list of notes with tags. bind UI components directly to live queries. demonstrate adding/deleting notes. demonstrate queries bound to tags updating live. following queries should work:

all notes => db.table(‘main’).filter({type:’note’)
all notes sorted => type:note, orderBy(field:’date, reverse:false)
list of categories => db.table(‘main’).filter({type:’note’).unique('category’).orderBy(field:’category', reverse:false})
one note => db.table(‘main’).get(id).on(‘result’)

list bound directly to a query
editor bound directly to an id. can monitor if it’s be modified or deleted elsewhere. (don’t worry about field merging)
function to make a new one
function to update one
function to delete one


add an email client with fake inbox and a button to trigger incoming mail

queries:
inbox =>  type:email, orderBy:’date’, fields:[‘from’,’subject’,’date’]
folders => type:email, unique(‘folder’), orderBy(‘name’)
search=> type:email, “subject|from|to|body contains %”, orderBy(‘date’)





make an interface mockup, don’t do implementation yet.

evernote-like list of notes (no editing)
things-like list of todos (no editing)
mail inbox w/ folders and main doc (no editing)
mp3 player
file listing showing some images
calendar interface mockup
address book interface
reminders interface
maps interface
all in windows that you can drag around
cli / search / combiner tool

most windows have a master-detail view with action buttons at the top
calendar has a custom month view
cli window has a custom view showing some results

window: draggable title bar, close button, max button, action bar, status bar, content area
content area, infinite list on the left bound to a query, allows single and multiple selection.
content area, center/right area has the main view bound to the selection of the list
action bar is a horizontal list of push buttons
status bar is a horizontal list of labels

calendar has a list of calendars on the left, main view is grid view, toggle buttons in action bar to switch between day/week/month views
reminders is the a list of notes with timestamps
you can add a timestamp to any other document to make it show up in reminders. todos, notes, address book, event, email, etc.
maps has a list of bookmarks on the left + a search box. center is a map showing the currently selected area.


lets start with the mp3 player since it’s useful and doesn’t require editing yet.  
* make a command line mp3 player. loads giant JSON at startup
* lets you search with tab completion
* shows current status on the previous line? end of line?

type a song or album or artist, comes up with an auto completion list. keep typing or select something from the list. if it gives you an album you can select play all or choose a song. if you select an artist you get a list of albums or choose play all. if you get a song you just play it.
once you choose something to play it keeps playing to the next track in the appropriate sequence. typing again starts a new query. hitting escape cancels the current query.


