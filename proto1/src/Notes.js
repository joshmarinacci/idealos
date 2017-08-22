import React, {Component} from "react"
import {HBox, VBox} from "appy-comps";
import {PushButton, CheckButton, ListView, Scroll, Input} from "./GUIUtils";
import RemoteDB from "./RemoteDB"

let NoteTemplate = (props) => {
    return <HBox>{props.item.title}</HBox>
}

let NoteView = (props)=>{
    if(!props.note) return <VBox>no note selected</VBox>
    return <VBox>{props.note.body}</VBox>
};
export default class Notes extends Component {
    constructor(props) {
        super(props);
        this.db = new RemoteDB("notes");
        this.db.connect();
        this.notes = this.db.makeLiveQuery({type:'note'});
        this.state = {
            selected:null,
            query:''
        };
        this.typeQuery = (e) => this.setState({query:e.target.value});
        this.selectNote = (note) => {
            this.setState({selected:note});
        }
    }
    render() {
        return <VBox>
            <HBox>
                <Input ref='search' onChange={this.typeQuery}
                       value={this.state.query}
                       db={this.props.db}
                />
            </HBox>
            <HBox>
                <Scroll>
                    <ListView model={this.notes}
                              template={NoteTemplate}
                              onSelect={this.selectNote}
                              selected={this.state.selected}/>
                </Scroll>
                <NoteView note={this.state.selected}/>
            </HBox>
        </VBox>
    }
};