import React, {Component} from "react"
import {HBox, VBox} from "appy-comps";
import {PushButton, CheckButton, ListView, Scroll} from "./GUIUtils";
import {DB} from "./Database";
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
    return <HBox>
        <CheckButton value={props.item.completed}/>
        <label>{props.item.text}</label>
    </HBox>
};
export default class Todos extends Component {
    constructor(props) {
        super(props);
        this.query = DB.makeLiveQuery({type:'todo'}, {order:{completed:true}});
        this.createTodo = () => {
            DB.insert({
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
                <ListView model={this.query} template={TodoTemplate}/>
            </Scroll>
        </VBox>
    }
}
