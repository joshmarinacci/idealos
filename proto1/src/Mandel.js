import React, {Component} from "react"
import {CheckButton, ListView, PushButton} from "./GUIUtils";
import {HBox, PopupManager, PopupMenu, VBox} from "appy-comps"
import RemoteDB from "./RemoteDB"

export default class Mandel extends Component {
    constructor(props) {
        super(props);
        this.db = new RemoteDB("mandelbrot");
        this.db.connect();
    }
    render() {
        return <VBox grow>
            mandel
        </VBox>
    }
}
