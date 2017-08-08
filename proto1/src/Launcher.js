import React, {Component} from 'react';
import {VBox} from "appy-comps"

export default class Launcher extends Component {
    startApp(app) {
        this.props.db.sendMessage({
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
            <button onClick={() => this.startApp("alarms")} className="fa fa-clock-o"></button>
            <button onClick={() => this.startApp('musicplayer')} className="fa fa-music"></button>
            <button onClick={() => this.startApp('contacts')} className="fa fa-address-book"></button>
            <button onClick={() => this.startApp('todolist')} className="fa fa-list"></button>
            <button onClick={() => this.startApp('notes')} className="fa fa-sticky-note"></button>
            <button onClick={() => this.startApp('clipboard')} className="fa fa-clipboard"></button>
            <button onClick={() => this.startApp('calendar')} className="fa fa-calendar"></button>
        </VBox>
    }
}
