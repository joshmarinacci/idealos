import Alarms from "./Alarms";
import MusicPlayer from "./MusicPlayer";
import Contacts from "./Contacts";
import Todos from "./Todo";
import Notes from "./Notes";
import ClipboardViewer from "./ClipboardViewer";
import Calendar from "./Calendar";
import DebugPanel from "./DebugPanel";

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
    }
};
