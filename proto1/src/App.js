
import React, {Component} from 'react';
import FakeWindow from "./FakeWindow";
import {VBox, PopupContainer} from "appy-comps";
import {APP_REGISTRY} from "./Constants";

import Launcher from "./Launcher";
import RemoteDB from "./RemoteDB";
import CommandBar from "./CommandBar";
import NotificationViewer from "./NotificationViewer";

import './App.css';
import "font-awesome/css/font-awesome.css";



class App extends Component {
    constructor(props) {
        super(props);
        this.DB = new RemoteDB('master');
        this.state = {
            apps: [],
            connected: false,
        };
        this.DB.on('connect', (m) => {
            console.log("fully connected", m);
            this.setState({connected: true})
        });
        this.DB.on("receive", (m) => {
            console.log("got a message back", m);
        });
        this.DB.listenMessages((msg)=>{
            console.log("message came in",msg);
            if(msg.type==='command') {
                if(msg.command === 'launch') return this.launch(msg);
                if(msg.command === 'close') return this.close(msg);
                if(msg.command === 'enter-fullscreen') return this.enterFullscreen();
            }
        });
        this.DB.connect();
    }

    nextId() {
        if (!this.id) this.id = 0;
        this.id++;
        return this.id;
    }

    launch(msg) {
        var apps = this.state.apps.slice();
        if (!APP_REGISTRY[msg.app]) {
            console.log("unknown app", msg.app);
            return;
        }
        const info = APP_REGISTRY[msg.app];
        const AppComponent = info.app;
        const appid = this.nextId();
        apps.push({title: info.title, app: <AppComponent appid={appid}/>, appid: appid});
        this.setState({apps: apps});


        this.DB.insert({
            type: 'notification',
            read: false,
            title: 'launched ' + msg.app
        });

    }

    close(msg) {
        this.setState({apps: this.state.apps.filter(a => a.appid !== msg.appid)});
    }

    enterFullscreen() {
        console.log("we can enter fullscreen");
    }

    render() {
        if(!this.state.connected) return <VBox></VBox>;
        return (
            <VBox>
                {this.state.apps.map((a, i) => <FakeWindow title={a.title} key={i}
                                                           appid={a.appid}>{a.app}</FakeWindow>)}
                <Launcher/>
                <CommandBar/>
                {this.renderNotificationViewer()}
                <PopupContainer/>
            </VBox>
        );
    }

    renderNotificationViewer() {
        if (this.state.connected) return <NotificationViewer/>
        return "not connected";
    }
}

export default App;
