import React, {Component} from "react"
import {HBox, VBox, Spacer} from "appy-comps";
import {Input, ListView, Scroll, Toolbar} from './GUIUtils'
import RemoteDB from "./RemoteDB";

const MailboxTemplate = ((props)=>{
    return <div>{props.item.name}</div>
});
const EmailSummaryTemplate = ((props)=>{
    return <VBox className="mail-item">
        <HBox>
            <span className="name">John Smith</span>
            <Spacer/>
            <span className="time">8:40 AM</span>
        </HBox>
        <span className="subject">Re: cool stuff</span>
        <span className="summary">Yeah, you're right.
                                I totally know what you ...</span>
    </VBox>

    // return <div>{props.item.from} : {props.item.subject}</div>
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
            <Toolbar>
                <button onClick={this.archiveMessage} className="fa fa-archive"/>
                <button onClick={this.composeMessage} className="fa fa-pencil"/>
                <Spacer/>
                <Input className='search' db={this.db}/>
            </Toolbar>
            <div className="email-app-grid">
                    <ListView model={this.root}
                              template={MailboxTemplate}
                              selected={this.state.selectedFolder}
                              onSelect={this.selectFolder}/>
                    <ListView model={this.inbox}
                              template={EmailSummaryTemplate}
                              onSelect={this.selectEmail}
                              selected={this.state.selectedEmail}
                    />
                <div style={{backgroundColor:'white'}}>
                    {this.renderSelectedEmail(this.state.selectedEmail)}
                </div>
            </div>
        </VBox>
    }

    renderSelectedEmail(em) {
        if(!em) return <div>nothing selected</div>
        return <div>
            {em.content.text}
        </div>
    }
}