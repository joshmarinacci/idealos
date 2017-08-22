import React, {Component} from "react"
import {HBox, VBox} from "appy-comps";
import RemoteDB from "./RemoteDB"
import {PushButton, CheckButton, ListView, Scroll} from "./GUIUtils";
/*
 # To do List

 items = query all docs type == todo_item, ordered by position
    vbox
        hbox
            push_button: insert new type==todo_item
        scroll listview
            template(item)
                check_button <= item.completed
                text_line    <= item.title
                text_area    <= item.description
                tag_box      <= item.tags, query all docs type == todo_item, union item.tags, unique by tag,
*/

let TodoTemplate = (props)=>{
    function complete() {
        props.item.completed = true;
        props.model.sendDocumentUpdate(props.item);
    }
    return <HBox>
        <CheckButton value={props.item.completed} onChange={complete}/>
        <label>{props.item.text}</label>
    </HBox>
};
export default class Todos extends Component {
    constructor(props) {
        super(props);
        this.db = new RemoteDB("todos");
        this.db.connect();
        this.query = this.db.makeLiveQuery({type:'todo',completed:false});
        this.createTodo = () => {
            this.db.insert({
                type:'todo',
                text:'one more thing to do',
                completed:false,
            });
        }
    }
    render() {
        return <VBox grow>
            <HBox>
                <PushButton onClick={this.createTodo} className='fa fa-plus'>+</PushButton>
            </HBox>
            <Scroll>
                <ListView model={this.query} template={TodoTemplate} onSelect={()=>console.log("selected")}/>
            </Scroll>
        </VBox>
    }
}
