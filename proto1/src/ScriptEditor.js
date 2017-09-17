import React, {Component} from "react"
import {VBox, HBox, Spacer} from "appy-comps"
import {ListView, Scroll} from "./GUIUtils"
import RemoteDB from "./RemoteDB"

import brace from 'brace';
import 'brace/mode/java';
import 'brace/theme/github';
import AceEditor from 'react-ace';



const sampleCode =
    `function foo() {
  console.log("printing out",4+5);
}`;


let ScriptItemTemplate = (props) => {
    return <HBox>
        {JSON.stringify(props.item.trigger)}
        <Spacer/>
        {props.item.active?"*":""}
    </HBox>
};

export default class TextEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            language:'text',
            selectedScript:{
                code:'//no script selected',
                language:'javascript'
            }
        };
        this.db = new RemoteDB("texteditor");
        this.db.connect();
        this.scripts = this.db.makeLiveQuery({type: 'script'});

    }

    selectScript = (scr) => {
        this.setState({selectedScript:scr})
    };

    updateCode = (code) => {
        const scr = this.state.selectedScript;
        scr.code = code;
        this.setState({selectedScript: scr});
    };

    saveActive = () => {
        const scr = this.state.selectedScript;
        scr.active = true;
        console.log("saving", scr);
        this.db.update(scr);
        this.setState({selectedScript: scr});
    };
    saveNotActive = () => {
        const scr = this.state.selectedScript;
        scr.active = true;
        console.log("saving", scr);
        this.db.update(scr);
        this.setState({selectedScript: scr});
    };

    render() {
        return <HBox style={{
            flex:1
        }}>
            <VBox style={{
                minWidth:'200px'
            }}>
                <Scroll>
                    <ListView model={this.scripts}
                              template={ScriptItemTemplate}
                              onSelect={this.selectScript}
                              selected={this.state.selectedScript}/>
                </Scroll>
            </VBox>
            <VBox grow style={{
                border:'1px solid gray',
                flex:1,
            }}>
                <HBox>
                    <button onClick={this.saveActive}>set active</button>
                    <button onClick={this.saveNotActive}>set not active</button>
                </HBox>
                <AceEditor
                    mode="javascript"
                    theme="github"
                    showGutter={true}
                    value={this.state.selectedScript.code}
                    onChange={this.updateCode}
                    style={{
                        // /flex:1,
                        // width:'100%',
                        // height:'100%'
                    }}
                />
            </VBox>
        </HBox>
    }
}

