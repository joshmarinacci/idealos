/*
 contacts_list is query all docs type == contact
 contacts_view is hbox
 vbox
 searchbox <= app.filter
 list <= contacts_list filterby app.filter
 vbox
 hbox
 label: selected.first
 label: selected.last
 hbox
 label: selected.company
 vbox
 selected.phones => map (contact)
 hbox
 label: phone.type
 label: phone.number
 vbox
 selected.addresses => map (address)
 hbox
 label: address.type
 label: address.street
 hbox
 label: address.city
 label: address.state
 label: address.zip



 */

import React, {Component} from "react"
import {HBox, VBox, PopupManager} from "appy-comps";
import {Input, ListView, Scroll, Toolbar} from './GUIUtils'
import RemoteDB from "./RemoteDB"
import {ProfileImage} from "./ProfileImage";
import SelectMenu from "./SelectMenu";


function cloneObject(obj) {
    const oo = {};
    Object.keys(obj).forEach((name)=>{
        oo[name] = obj[name];
    });
    return oo;
}
let ContactTemplate = (props) => {
    var src = resourceToURL(props.item.avatar);
    return <HBox>
        <img src={src} width={32} height={32}/>
        {props.item.first} {props.item.last}
    </HBox>
};


let ContactView = (props) => {
    var c = props.contact;
    if (!c) return <VBox></VBox>;
    if (!c.address) c.address = [];
    return <VBox grow>
        <ProfileImage size={64} item={c.id}/>
        <label>{c.first} {c.last}</label>
        {c.address.map((addr, i) => {
            return <VBox key={i}>
                <HBox><label>{addr.street}</label></HBox>
                <HBox><label>{addr.city}</label>
                    <label>{addr.state}</label>
                    <label>{addr.zip}</label>
                </HBox>
            </VBox>
        })}
    </VBox>
};

function resourceToURL(avatar) {
    if(avatar.indexOf("resource:") === 0) {
        var id = avatar.slice("resource:".length);
        avatar = "http://localhost:5151/api/resource/"+id;
    }
    return avatar;
}

export class ContactEdit extends Component {
    showAvatarPicker() {
        const query = this.props.db.makeLiveQuery({type: 'image'});
        this.popupMenu = <SelectMenu query={query}
                                     template={(item) => {
                                         const src = `http://localhost:5151/api/resource/${item.id}`;
                                         return <img src={src} width={32} height={32}/>
                                     }}
                                     onSelect={(item) => {
                                         this.props.onEdit(this.props.contact,'avatar','resource:'+item.id);
                                         PopupManager.hide();
                                         this.popupMenu = null;
                                     }}
        />;
        PopupManager.show(this.popupMenu, this.refs.img);
    }
    render() {
        const src = resourceToURL(this.props.contact.avatar);
        return <VBox>
            <img ref="img" width={64} height={64} onClick={this.showAvatarPicker.bind(this)} src={src}/>
            <label>editing</label>
        </VBox>
    }
}
export default class Contacts extends Component {
    constructor(props) {
        super(props);
        this.db = new RemoteDB("contacts");
        this.db.connect();
        this.contacts = this.db.makeLiveQuery({type: 'contact'});
        this.state = {
            selectedContact: null,
            searchQuery: '',
            editing: false
        };
        this.selectContact = (contact) => this.setState({selectedContact: contact});
        this.typeQuery = (e) => {
            const txt = e.target.value;
            this.setState({searchQuery:txt});
            this.contacts.updateQuery({
                type: 'contact',
                first: { $regex: `^${txt}`, $options:'i' }
            });
        };

        this.editContact = () => {
            if(this.state.editing) {
                this.db.update(this.state.selectedContact);
                this.setState({editing:false});
            } else {
                this.setState({editing: true})
            }
        };

        this.contactEdited = (contact, field, value) => {
            console.log("field",field,'goes to',value);
            contact = cloneObject(contact);
            contact[field] = value;
            this.setState({selectedContact:contact});
        }
    }

    render() {
        let view = this.state.editing?<ContactEdit contact={this.state.selectedContact} db={this.db} onEdit={this.contactEdited}/>:<ContactView contact={this.state.selectedContact}/>;
        let text = this.state.editing?"Done":"Edit";
        return <VBox grow>
            <Toolbar>
                <Input onChange={this.typeQuery} db={this.db} value={this.state.searchQuery}/>
            </Toolbar>
            <div className="grid-2">
                <ListView model={this.contacts}
                          template={ContactTemplate}
                          onSelect={this.selectContact}
                          selected={this.state.selectedContact}/>
                <VBox grow style={{backgroundColor:'white'}}>
                    <button onClick={this.editContact}>{text}</button>
                    {view}
                </VBox>
            </div>
        </VBox>
    }
}
