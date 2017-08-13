import React, {Component} from "react";
import {VBox, HBox} from "appy-comps";

export default class DebugPanel extends Component {
    constructor(props) {
        super(props);
        this.enterFullscreen = () => {
            props.db.sendMessage({
                type:'command',
                target:'system',
                command:'enter-fullscreen'
            })
        }
    }
    render() {
        return <VBox>
            <h3>Debug</h3>
            <HBox><button onClick={this.enterFullscreen}>full screen</button></HBox>
        </VBox>
    }
}