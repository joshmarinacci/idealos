/*


* when clicking on a link, detect when changing the url
* back and forward set a new url
* store history as a constantly growing list


 */

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
        };

        this.navBack = () => {
        };

        this.navForward = () => {
        };

        this.load = () => {
            console.log("loaded", this.refs.iframe, this.refs.iframe.contentWindow);
        };

    }
    render() {
        return <VBox grow>
            <HBox>
                <button className="fa fa-arrow-left" onClick={this.navBack}/>
                <button className="fa fa-arrow-right" onClick={this.navForward}/>
                <Input db={this.db} value={this.state.url} style={{flex:1}}/>
            </HBox>
            <HBox grow>
                <iframe ref="iframe" src={this.state.url} style={{flex:1}} onLoad={this.load}/>
            </HBox>
        </VBox>
    }
}
