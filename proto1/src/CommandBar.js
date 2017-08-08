import React, {Component} from "react";
import {Input} from "./GUIUtils";


export default class CommandBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            command:"alarm"
        };

        this.keydown = (e) => { if(e.keyCode === 13) this.runCommand(); };
        this.edited = (e) => this.setState({command:e.target.value});
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
            <Input type="text" value={this.state.command} onKeyDown={this.keydown} onChange={this.edited} db={this.props.db}/>
        </div>
    }
}
