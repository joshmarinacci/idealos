import React, {Component} from "react"
import {HBox, VBox, Spacer} from "appy-comps";
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
        this.archiveMessage = () => {
            this.db.update({
                id:this.state.selectedEmail,
                folders:['id_archive']
            })
        };
        this.composeMessage = () => {
            this.db.sendMessage({
                type:'command',
                target: 'system',
                command: "launch",
                app: 'compose-email',
            });
        }

        this.db.whenConnected(()=>{
            this.db.sendMessage({
                type:'command',
                target: 'system',
                command: "resize",
                appid: this.props.appid,
                width:500,
                height:400
            });
        })

    }
    render() {
        return <VBox grow>
            <HBox>
                <button onClick={this.archiveMessage}>archive</button>
                <button onClick={this.composeMessage}>compose</button>
                <Spacer/>
                <Input db={this.db}/>
            </HBox>
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