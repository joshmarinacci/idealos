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
            console.log("clipboard happened",msg);
            //store new clippings into the database
            this.db.insert({
                type:'clip',
                text:msg.payload
            });
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
