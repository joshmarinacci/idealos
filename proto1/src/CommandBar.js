import React, {Component} from "react";
import {Input} from "./GUIUtils";


export default class CommandBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            command:"",
            data:[],
        };

        this.query = props.db.makeLiveQuery({type:'app'});

        this.query.on('update', (data) =>  {
            console.log("update",data);
            this.setState({data: data})
        });
        this.query.on('execute', (data) => {
            console.log("execute",data);
            this.setState({data: data})
        });

        this.query.execute();

        this.keydown = (e) => { if(e.keyCode === 13) this.runCommand(this.state.command); };
        this.edited = (e) => {
            const txt = e.target.value;
            this.setState({command:txt});
            this.query.updateQuery({type:'app', name: { $regex:txt, $options:'i'}});
        }

    }
    runCommand(app) {
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
            <Input ref='text' type="text" value={this.state.command} onKeyDown={this.keydown} onChange={this.edited} db={this.props.db}/>
            {this.renderDropdown()}
        </div>
    }

    renderDropdown() {
        if(this.state.command.length < 2) return <ul></ul>;
        return <ul className="dropdown">
            {this.state.data.map((app,i) => {
                return <li key={i} onClick={()=>this.runCommand(app.name)}>{app.title}</li>
            })}
        </ul>
    }
}
