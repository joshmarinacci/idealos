import React, {Component} from 'react';
import {HBox, VBox} from "appy-comps"
import {ListView} from "./GUIUtils";
import RemoteDB from "./RemoteDB"

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
        this.db = new RemoteDB("notificationviewer");
        this.db.connect();

        const cleared = {};
        this.query = this.db.makeLiveQuery({type: 'notification', read:false});

        //clear each notification three seconds after it appears
        const scheduleClear = (data) => {
            data.forEach((doc)=>{
                if(!cleared[doc.id]) {
                    cleared[doc.id] = setTimeout(()=>{
                        doc.read = true;
                        this.query.sendDocumentUpdate(doc);
                    },3000);
                }
            })
        };
        this.query.on('update', scheduleClear);
        this.query.on('execute', scheduleClear);
    }

    render() {
        return <VBox style={{
            position: 'absolute',
            left: 10,
            bottom: 10,
            width:'10em',
        }} className="notifications">
            <ListView model={this.query} template={NotificationTemplate}/>
        </VBox>
    }
}