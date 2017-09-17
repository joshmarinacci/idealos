import React, {Component} from "react"
import {VBox} from "appy-comps"
import RemoteDB from "./RemoteDB"

import CodeMirror  from "react-codemirror";
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';

const sampleCode =
`function foo() {
  console.log("printing out",4+5);
}`;

export default class TextEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: sampleCode,
            language:'text'
        };
        this.db = new RemoteDB("texteditor");
        this.db.connect();

    }

    componentDidMount() {
        console.log("setting up code flask");
    }

    render() {
        var options = {
            lineNumbers:true,
            mode:this.state.language
        };
        return <VBox grow style={{}}>
            <CodeMirror value={this.state.code} options={options}
                        style={{flex:1,
                            border: '1px solid black'
                        }}
            />
        </VBox>
    }
}

/*
                <textarea style={{
                    flex: 1,
                    margin: 0,
                    padding: '0.5em',
                    border: '0px solid black'
                }} rows={20}></textarea>

 */