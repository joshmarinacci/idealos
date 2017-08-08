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
import {PushButton, CheckButton, ListView, Scroll} from "./GUIUtils";

let ContactTemplate = ((props) => <label>{props.item.first} {props.item.last}</label>);
let ContactView = ((props) => {
    var c = props.contact;
    if(!c) return <VBox></VBox>;
    if(!c.address) c.address = [];
    return <VBox>
        <label>{c.first} {c.last}</label>
        {c.address.map((addr,i) => {
            return <VBox key={i}>
                <HBox><label>{addr.street}</label></HBox>
                <HBox><label>{addr.city}</label>
                    <label>{addr.state}</label>
                    <label>{addr.zip}</label>
                </HBox>
            </VBox>
        })}
    </VBox>
});

export default class Contacts extends Component {
    constructor(props) {
        super(props);
        this.contacts = props.db.makeLiveQuery({type:'contact'});
        this.state = {
            selectedContact: null,
            searchQuery:''
        };
        this.selectContact = (contact) => {
            this.setState({selectedContact:contact});
        };
        this.typeQuery = () => {
            let query = this.refs.search.value;
            this.setState({searchQuery:query});
            this.contacts.updateQuery({type:'contact',first:query})
        }
    }
    render() {
        return <VBox grow>
            <HBox>
                <input ref='search' onChange={this.typeQuery}
                       value={this.state.searchQuery}/>
            </HBox>
            <HBox grow>
                <Scroll>
                    <ListView model={this.contacts}
                              template={ContactTemplate}
                              onSelect={this.selectContact}
                              selected={this.state.selectedContact}/>
                </Scroll>
                <ContactView contact={this.state.selectedContact}/>
            </HBox>
        </VBox>
    }
}
