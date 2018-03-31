import React, {Component} from "react"
import {HBox, VBox, Spacer, PopupManager, PopupMenu} from 'appy-comps'
import {Input, ListView, Scroll, Toolbar} from './GUIUtils'
import RemoteDB from "./RemoteDB";
import SelectMenu from './SelectMenu'
import moment from 'moment'

const PersonTemplate = (props) => {
    var src = resourceToURL(props.item.avatar);
    const time = moment().utcOffset(props.item.timezone)

    return <VBox className="online">
        <img className="avatar"
            src={src} width={64} height={64}/>
        <HBox>
            <span>{props.item.first}</span>
            <span className="spacer"></span>
            <i className="fa fa-circle"></i>
        </HBox>
        <HBox>
            <span>{time.format('h:m A')}</span>
        </HBox>
    </VBox>

}

function resourceToURL(avatar) {
    if(avatar.indexOf("resource:") === 0) {
        var id = avatar.slice("resource:".length);
        avatar = "http://localhost:5151/api/resource/"+id;
    }
    return avatar;
}


const actions = [
    'chat',
    'email',
    'call',
    'file'
]
export default class PeopleViewer extends Component {
    constructor(props) {
        super(props);

        this.db = new RemoteDB("contacts");
        this.db.connect();
        this.contacts = this.db.makeLiveQuery({type:'contact', pinned:true})
        this.state = {
        }

        this.changed = (contact) => {
            console.log("invoking the action",contact)
            if(contact === 'email') {
                this.db.sendMessage({
                    type:'command',
                    target: 'system',
                    command: "launch",
                    app: 'compose-email',
                });
            }
            PopupManager.hide()
        }
    }
    render() {
        return <VBox className="people-bar">
            <ListView model={this.contacts}
                      template={PersonTemplate}
                      onSelect={this.selectContact}
            />
        </VBox>
    }

    selectContact = (contact) => {
        console.log("selected",contact,this.changed)
        const popupMenu = <PopupMenu list={actions}
                                     template={ActionTemplate}
                                     onChange={this.changed}/>
        PopupManager.show(popupMenu, null);
    }


}

const ActionTemplate = (props) => {
    return <div onClick={props.onSelect}>{props.item}</div>
}