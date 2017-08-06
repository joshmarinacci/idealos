import React, {Component} from "react";

export default class CommandBar extends Component {
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
