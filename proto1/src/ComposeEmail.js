import React, {Component} from "react"
import {HBox, VBox} from "appy-comps";
import RemoteDB from "./RemoteDB";

export default class ComposeEmail extends Component {
    constructor(props) {
        super(props);
        this.db = new RemoteDB("compose-email");
        this.db.connect();
        this.state = {
            to:'',
            subject:'',
            body:''
        };
        this.edited = (e,name) => {
            var ch = {};
            ch[name] = e.target.value;
            this.setState(ch);
        };

        this.send = () => {
            //add document to the outbox
            this.db.insert({
                type:'email',
                from:'me@home.io',
                to:this.state.to,
                subject:this.state.subject,
                content: {
                    text:this.state.body
                },
                folders:['id_outbox']
            });
            //send a close message
            this.db.sendMessage({
                type: 'command',
                target: 'system',
                command: "close",
                appid: this.props.appid,
            });

        }
    }

    render() {
        return <VBox grow>
            <HBox>
                <label>to</label>
                <input onChange={(e)=>this.edited(e,'to')}/>
            </HBox>
            <HBox>
                <label>subject</label>
                <input onChange={(e)=>this.edited(e,'subject')}/>
            </HBox>

            <textarea style={{flex: 1}} onChange={(e)=>this.edited(e,'body')}></textarea>

              <HBox>
                  <button onClick={this.send}>send</button>
                  <button>cancel</button>
              </HBox>
        </VBox>
    }
}
