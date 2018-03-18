/*

design:

list of friends in a sidebar with a search at the top
shows name of that friend and avatar
shows if they are online or not. fake that they are all online.
select user, shows conversation history

type:message
service:facebook
from:id of person
to:id of person
content { text: text of the message as plain text}
timestamp

to show a conversation, select all type:message, service:*, from:me|you, to:me|you, order by timestamp

add a message to the conversation by typing
a service in the backend echos back as that user saying: well, what do you think about $message


 */

import React, {Component} from "react"
import {HBox, VBox} from "appy-comps";
import {Input, ListView, Scroll, Toolbar} from './GUIUtils'
import RemoteDB from "./RemoteDB"
import {ProfileImage} from "./ProfileImage";

const ContactTemplate = (props) => {
    return <HBox><ProfileImage size={32} item={props.item.id}/> {props.item.first} (online)</HBox>
};
const ConversationItemTemplate = (props) => {
    return <HBox><ProfileImage size={32} item={props.item.from}/>{props.item.from} {props.item.text}</HBox>
};

export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.db = new RemoteDB("chat");
        this.db.connect();
        this.contacts = this.db.makeLiveQuery({type:'contact'});
        this.conversation = this.db.makeLiveQuery({type:'message',from:'dummy'});
        this.state = {
            selectedContact:null,
            searchQuery:'',
        };
        this.selectContact = (c)=>{
            this.setState({selectedContact:c});
            this.conversation.updateQuery({type:'message', $or:[{from:c.id},{to:c.id}]});
        }
    }
    render() {
        return <VBox grow>
            <Toolbar>
                <Input db={this.db}/>
            </Toolbar>
            <div className="grid-2">
                <ListView model={this.contacts}
                          template={ContactTemplate}
                          onSelect={this.selectContact}
                          selected={this.state.selectedContact}
                />
                <VBox grow style={{backgroundColor:'white'}}>
                    <label>conversation</label>
                    <ListView model={this.conversation}
                              template={ConversationItemTemplate}
                    />
                </VBox>
            </div>

        </VBox>
    }
}
