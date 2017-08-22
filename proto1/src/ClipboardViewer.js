import React, {Component} from 'react';
import {HBox} from "appy-comps";
import RemoteDB from "./RemoteDB"

export default class ClipboardViewer extends Component {
    constructor(props) {
        super(props);
        this.db = new RemoteDB("clipboard-viewer");
        this.db.connect();
        this.state = {
            items:[],
        };
        this.db.on('clipboard',(msg)=>{
            var items = this.state.items.slice();
            items.push(msg.payload);
            this.setState({items:items});
        })
    }

    render() {
        return <HBox
        >{this.state.items.map((it,i)=>{
            return <li key={i}>{it}</li>
        })}</HBox>
    }
}
