import React, {Component} from 'react';
import {HBox, VBox} from "appy-comps"
import {ListView} from "./GUIUtils";

const style = {
    borderRadius:'0.25em',
    backgroundColor:'#ffcccc',
    color:'#555',
    padding:'0.5em'
};
const NotificationTemplate = (props) => {
    return <HBox style={style}>{props.item.title}</HBox>
};

export default class NotificationViewer extends Component {

    constructor(props) {
        super(props);
        this.query = props.db.makeLiveQuery({type:'notification'}, {order:{time:true}});
    }

    render() {
        return <VBox style={{
            position: 'absolute',
            left: 10,
            top: 10,
            width:'10em',
            minHeight:'5em',
        }} className="notifications">
            <ListView model={this.query} template={NotificationTemplate}/>
        </VBox>
    }
}