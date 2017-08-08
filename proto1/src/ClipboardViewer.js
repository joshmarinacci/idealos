import React, {Component} from 'react';
import {HBox} from "appy-comps";

export default class ClipboardViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items:[],
        };
        this.props.db.on('clipboard',(msg)=>{
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
