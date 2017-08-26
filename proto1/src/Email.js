import React, {Component} from "react"
import {HBox, VBox} from "appy-comps";
import {Input, ListView, Scroll} from "./GUIUtils";
import RemoteDB from "./RemoteDB";

let MailboxTemplate = ((props)=>{
    return <div>{props.item.name}</div>
});
let EmailSummaryTemplate = ((props)=>{
    return <div>{props.item.from} : {props.item.subject}</div>
});
export default class Email extends Component {
    constructor(props) {
        super(props);
        this.db = new RemoteDB("email");
        this.db.connect();

        this.root = this.db.makeLiveQuery({type:'folder', folders:'id_root'});
        this.inbox = this.db.makeLiveQuery({type:'email', folders:['id_inbox']});
        this.state = {
            selectedFolder:null,
            selectedEmail:null
        };
        this.selectFolder = (item) => {
            this.setState({selectedFolder:item});
            this.inbox.updateQuery({type:'email', folders:[item.id]})
        };
        this.selectEmail  = (item) => this.setState({selectedEmail:item});
    }
    render() {
        return <VBox grow>
            <HBox grow>
                <Scroll>
                    <ListView model={this.root} template={MailboxTemplate} selected={this.state.selectedFolder} onSelect={this.selectFolder}/>
                </Scroll>
                <Scroll>
                    <ListView model={this.inbox}
                              template={EmailSummaryTemplate}
                              onSelect={this.selectEmail}
                              selected={this.state.selectedEmail}
                    />
                </Scroll>
                <div style={{flex:1}}>
                    {this.renderSelectedEmail(this.state.selectedEmail)}
                </div>
            </HBox>
        </VBox>
    }

    renderSelectedEmail(em) {
        if(!em) return <div>nothing selected</div>
        return <div>
            {em.content.text}
        </div>
    }
}