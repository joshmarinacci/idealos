import React, {Component} from 'react';
import {HBox} from "appy-comps";
import {ListView, Scroll} from "./GUIUtils";
import RemoteDB from "./RemoteDB"

const ClipTemplate = ((props)=><div>{props.item.text}</div>);

export default class ClipboardViewer extends Component {
    constructor(props) {
        super(props);
        this.db = new RemoteDB("clipboard-viewer");
        this.db.connect();
        this.state = {
            selected:null,
        };
        this.clips = this.db.makeLiveQuery({type: 'clip'});

        this.db.on('clipboard', (msg) => {
            if(msg.command === 'copy' || msg.command === 'cut') {
                //store new clippings into the database
                this.db.insert({
                    type: 'clip',
                    text: msg.payload
                });
            }
            if(msg.command === 'request-clip') {
                this.db.sendMessage({
                    type:'clipboard',
                    target:'system',
                    command:'respond-clip',
                    payload:this.state.selected?this.state.selected.text:"",
                    requestid:msg.requestid
                });
            }
        });

        this.selectClip = (clip)=>{
            this.setState({selected:clip});
        };
    }

    render() {
        return <HBox grow>
            <Scroll>
                <ListView model={this.clips}
                          template={ClipTemplate}
                          selected={this.state.selected}
                          onSelect={this.selectClip}
                />
            </Scroll>
        </HBox>

    }
}
