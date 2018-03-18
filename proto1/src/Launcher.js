import React, {Component} from 'react';
import {VBox} from "appy-comps"
import RemoteDB from "./RemoteDB";

export default class Launcher extends Component {
    constructor(props) {
        super(props);
        this.db = new RemoteDB("launcher");
        this.db.connect();
    }
    startApp(app) {
        this.db.sendMessage({
            type:'command',
            target: 'system',
            command: "launch",
            app: app,
        });
    }

    render() {
        return <VBox style={{
            position: 'absolute',
            right: 10,
            top: 10,
        }} className="launcher">
            <button onClick={() => this.startApp('email')} className="fa fa-envelope"></button>
            <button onClick={() => this.startApp('chat')} className="fa fa-comment"></button>
            <button onClick={() => this.startApp('contacts')} className="fa fa-address-book"></button>
            <button onClick={() => this.startApp('calendar')} className="fa fa-calendar"></button>
            <button onClick={() => this.startApp('musicplayer')} className="fa fa-music"></button>
            <button onClick={() => this.startApp('todos')} className="fa fa-list"></button>
            <button onClick={() => this.startApp('notes')} className="fa fa-sticky-note"></button>
            <button onClick={() => this.startApp('browser')} className="fa fa-firefox"></button>
            <button onClick={() => this.startApp("alarms")} className="fa fa-clock-o"></button>
        </VBox>
    }
}
