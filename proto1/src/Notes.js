import React, {Component} from "react"
import {VBox, HBox, PushButton, CheckButton, ListView, Scroll} from "./GUIUtils";

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
        this.notes = props.db.makeLiveQuery({type:'note'});
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
                <input ref='search' onChange={this.typeQuery}
                       value={this.state.query}/>
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