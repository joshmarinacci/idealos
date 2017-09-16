import React, {Component} from "react"
import {VBox} from "appy-comps"
import RemoteDB from "./RemoteDB"

export default class TextEditor extends Component {
    constructor(props) {
        super(props);
        this.db = new RemoteDB("texteditor");
        this.db.connect();
    }

    render() {
        return <VBox grow style={{}}>
                <textarea style={{
                    flex: 1,
                    margin: 0,
                    padding: 0,
                    border: '1px solid black'
                }} rows={20}></textarea>
        </VBox>
    }
}
