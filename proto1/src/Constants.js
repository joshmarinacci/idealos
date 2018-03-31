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
import TextEditor from "./TextEditor";
import Mandel from "./Mandel";
import ScriptEditor from "./ScriptEditor";
import FileViewer from './FileViewer'
import PeopleViewer from './PeopleViewer'

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
    'todos': {
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
    },
    'texteditor':{
        title:'Text Editor',
        app: TextEditor
    },
    'mandelbrot':{
        title:'Mandlebrot Viewer',
        app: Mandel
    },
    'scripteditor': {
        title:'Script Editor',
        app: ScriptEditor
    },
    'files': {
        title:'File Finder',
        app: FileViewer
    },
    'people': {
        title:'People Bar',
        app: PeopleViewer
    }

};


export const SPECIAL_DOCS = {
    CURRENT_CLIPBOARD_SELECTION:'CURRENT_CLIPBOARD_SELECTION'
};