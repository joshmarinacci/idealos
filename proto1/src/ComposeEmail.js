import React, {Component} from "react"
import {HBox, VBox} from "appy-comps";

export default class ComposeEmail extends Component {
    render() {
        return <VBox grow>
            <HBox>
                <label>to</label>
                <input/>
            </HBox>
            <HBox>
                <label>subject</label>
                <input/>
            </HBox>

            <HBox>
                <button>send</button>
                <button>cancel</button>
            </HBox>
            <textarea style={{flex: 1}}></textarea>
        </VBox>
    }
}