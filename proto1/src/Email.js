import React, {Component} from "react"
import {HBox, VBox} from "appy-comps";
import {Input, ListView, Scroll} from "./GUIUtils";
import RemoteDB from "./RemoteDB";

let EmailSummaryTemplate = ((props)=>{
    return <div>{props.item.from} : {props.item.subject}</div>
});
export default class Email extends Component {
    constructor(props) {
        super(props);
        this.db = new RemoteDB("email");
        this.db.connect();
        this.inbox = this.db.makeLiveQuery({type:'email'});
        this.state = {
            selectedEmail:null
        };
        this.selectEmail = (em) => this.setState({selectedEmail:em})
    }
    render() {
        return <VBox grow>
            <HBox grow>
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