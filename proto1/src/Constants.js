import Alarms from "./Alarms";
import MusicPlayer from "./MusicPlayer";
import Contacts from "./Contacts";
import Todos from "./Todo";
import Notes from "./Notes";
import ClipboardViewer from "./ClipboardViewer";
import Calendar from "./Calendar";
import DebugPanel from "./DebugPanel";
import Browser from "./Browser";
import Email from "./Email";
import ComposeEmail from "./ComposeEmail";
import Chat from "./Chat";

export const APP_REGISTRY = {
    'alarms': {
        title: 'Alarm',
        app: Alarms,
    },
    'musicplayer': {
        title: 'Music Player',
        app: MusicPlayer,
    },
    'contacts': {
        title: 'Contacts',
        app: Contacts,
    },
    'todolist': {
        title: 'Todo List',
        app: Todos,
    },
    'notes': {
        title: 'Notes',
        app: Notes
    },
    'clipboard': {
        title:'Clipboard Viewer',
        app: ClipboardViewer
    },
    'calendar': {
        title:'Calendar',
        app: Calendar
    },
    'debug': {
        title:'Debug',
        app: DebugPanel
    },
    'browser': {
        title:"Web Browser",
        app: Browser,
    },
    'email': {
        title:'Mail',
        app: Email
    },
    'compose-email': {
        title:'Compose Mail',
        app: ComposeEmail
    },
    'chat':{
        title:'Chat',
        app: Chat
    }

};


export const SPECIAL_DOCS = {
    CURRENT_CLIPBOARD_SELECTION:'CURRENT_CLIPBOARD_SELECTION'
};