import React, {Component} from 'react';
import './App.css';
import FakeWindow from "./FakeWindow";
import "font-awesome/css/font-awesome.css";
import Alarms from "./Alarms";
import {VBox} from "./GUIUtils";
import Launcher from "./Launcher";
import MusicPlayer from "./MusicPlayer";
import Contacts from "./Contacts";
import Todos from "./Todo";

import RemoteDB from "./RemoteDB";
import Notes from "./Notes";
import ClipboardViewer from "./ClipboardViewer";


const APP_REGISTRY = {
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
    }
};

class App extends Component {
    constructor(props) {
        super(props);
        this.DB = new RemoteDB(this);
        this.state = {
            apps: []
        };
        this.DB.on('connect', (m) => {
            console.log("fully connected", m);
        });
        this.DB.on("receive", (m) => {
            console.log("got a message back", m);
        });
        this.DB.connect();
    }


    launch(msg) {
        console.log("launching an app");
        var apps = this.state.apps.slice();
        if(!APP_REGISTRY[msg.app]) {
            console.log("unknown app", msg.app);
            return;
        }
        var info = APP_REGISTRY[msg.app];
        var AppComponent = info.app;
        apps.push({title: info.title, app: <AppComponent db={this.DB}/>});
        this.setState({apps: apps});
    }

    render() {
        return (
            <VBox>
                {this.state.apps.map((a, i) => <FakeWindow title={a.title} key={i}>{a.app}</FakeWindow>)}
                <Launcher db={this.DB}/>
                <CommandBar db={this.DB}/>
            </VBox>
        );
    }
}

class CommandBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            command:"alarm"
        };

        this.keydown = (e) => { if(e.keyCode === 13) this.runCommand(); };
        this.edited = (e) => this.setState({command:e.target.value});
        this.copied = (e) => {
            var text = e.target.value.substring(e.target.selectionStart, e.target.selectionEnd);
            this.props.db.sendMessage({
                type:'clipboard',
                target:'system',
                command:'copy',
                payload:text
            })
        }
    }
    runCommand() {
        const app = this.state.command;
        this.props.db.sendMessage({
            type:'command',
            target: 'system',
            command: "launch",
            app: app,
        });
        this.setState({command:""})
    }
    render() {
        return <div className="command-bar">
            <input type="text" value={this.state.command} onKeyDown={this.keydown} onChange={this.edited} onCopy={this.copied}/>
        </div>
    }
}

export default App;
