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
import {HBox, VBox} from "appy-comps";
import {Input, ListView, Scroll} from "./GUIUtils";
import RemoteDB from "./RemoteDB"

let ContactTemplate = (props) => {
    return <HBox>
        <img src={props.item.avatar} width={32} height={32}/>
        {props.item.first} {props.item.last}
    </HBox>
};


let ContactView = (props) => {
    var c = props.contact;
    if (!c) return <VBox></VBox>;
    if (!c.address) c.address = [];
    return <VBox grow>
        <img src={c.avatar} width={64} height={64}/>
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

export default class Contacts extends Component {
    constructor(props) {
        super(props);
        this.db = new RemoteDB("contacts");
        this.db.connect();
        this.contacts = this.db.makeLiveQuery({type: 'contact'});
        this.state = {
            selectedContact: null,
            searchQuery: ''
        };
        this.selectContact = (contact) => this.setState({selectedContact: contact});
        this.typeQuery = (e) => {
            const txt = e.target.value;
            this.setState({searchQuery:txt});
            this.contacts.updateQuery({
                type: 'contact',
                first: { $regex: `^${txt}`, $options:'i' }
            });
        }
    }

    render() {
        return <HBox grow>
            <VBox>
                <Input onChange={this.typeQuery} db={this.db} value={this.state.searchQuery}/>
                <Scroll>
                    <ListView model={this.contacts}
                              template={ContactTemplate}
                              onSelect={this.selectContact}
                              selected={this.state.selectedContact}/>
                </Scroll>
            </VBox>
            <HBox grow>
                <ContactView contact={this.state.selectedContact}/>
            </HBox>
        </HBox>
    }
}
