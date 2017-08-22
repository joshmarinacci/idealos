import React, {Component} from 'react';
import {HBox, VBox} from "appy-comps";
import {ListView, Scroll, Input} from "./GUIUtils";
import RemoteDB from "./RemoteDB"

export default class Browser extends Component {
    constructor(props) {
        super(props);
        this.db = new RemoteDB("browser");
        this.db.connect();

        this.state = {
            url:'https://joshondesign.com/'
        }
    }
    render() {
        return <VBox grow>
            <HBox>
                <button className="fa fa-arrow-left"/>
                <button className="fa fa-arrow-right"/>
                <Input db={this.db} value={this.state.url} style={{flex:1}}/>
            </HBox>
            <HBox grow>
                <iframe src={this.state.url} style={{flex:1}}/>
            </HBox>
        </VBox>
    }
}
