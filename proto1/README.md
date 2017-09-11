# Ideal OS

the goal of this project is to experiment with ideas inside of IdealOS, in a robust
enough implementation that I can use it day to day, even if the implementation is very slow
and looks ugly.

core ideas to explore
* no filesystem, just database queries and opaque URLs to resources
* message passing for all syscalls and IPC
* opengl buffer sharing for compositing window manager
* multiple interfaces to the same data, ex: alarm and calendar vs up next view
* inter-app automation instead of traditional command shell w/ pipes
* separation of apps from services
* creating apps by composing live database queries with binding aware UI components for super 
compact app code
* apps speak in terms of actions, not key strokes. all keystrokes are intercepted by the OS and 
converted into actions. alternative inputs can be used to send actions, including other message 
events. 
* have different screens for different scenarios, ex: work vs home, database queries by default 
only search the current scenario.
* super clipboard with interesting system wide hooks.


core features:
* live database
* services 
  * play mp3 from a url
  * readonly view of contacts from google, using a hard coded config file
  * readonly view of email from google, using a hard coded config file
  * twitter service, using a hard coded config file
  * readonly view of calendar from google, using a hard coded config file
  * readonly facebook contacts
* apps
  * launcher which can start any other app
  * mp3 player, like itunes. includes mp3 service from my server as well as local database files
  * email client, read and respond to email
  * todo list, todos can have a due date
  * alarm
  * calendar
  * address book / contacts
  * up next app which shows items from alarms, todos, and calendar for the next 48 hours
  * twitter client, shows only my tweets and my replies and lets me respond
  * text editor with syntax highlighting for javascript. view, edit w/ undo, save.
  * cli which can launch apps or do queries, uses search results as db completion
  * diary app, uses standard text files w/ metadata
  * admin util
    * show count of docs and common types and total size of db and real files
    * show list of running apps
    * show list of running services, start and stop them
    * 
  * tweet explorer, save new queries for things like, my favorite tweets, or tweets matching a 
  hashtag
  * facebook client, shows you notifications from friends

query OS: make script start a server then open browser to point to it. 
alternatively, use react, open to the same server. 
server has in memory database, stored as giant json on disk. 
events to the browser via websockets server.

  * make npm run test-server start the server internally and run tests against it
  * make server which responds to websockets query
  * make client connect to websockets server, hard coded config
  * make npm run server start the server by itself
  * make npm run start run the client by itself
  * make npm run demo start server and build client and run client
  
  
  
  
the server maintains the database and sends out events when the database changes, for people who
have asked to listen to certain events.  events are sent out in response to queries. the queries
are saved and 'live'. if a document is added or changed which matches the query, then the query
owner will receive an event about it.

all apps are minimal bits of code running inside of a highly restricted container



----------------

Idea for Mark I prototype. 



* Should be possible to run from the command line and see something: `git co; npm install; npm start;`
* create a database server using simple JSON database and custom query system, based on mongo query.
* create a message bus impl using websockets, inside the db server.
* create UI with React, connects to server via websockets and express (for config).
* has simple apps for contacts, calendar, todo list, notes (~evernote), alarms, mp3 player.
* all windows are resizable and dockable to each other. spawn as many copies as you want.
* alert module can send notifications for alarms when they ring and calendar events.
* database pre-populated with mp3 URL files on the web somewhere
* database pre-populated with some notes, contacts, events, alarms, etc.
* add a due date for a todo list item, shows up in calendar too.
* mp3s and notes have realtime incremental search. 


avatar images from https://www.iconfinder.com/iconsets/user-avatars-1


