/*


* when clicking on a link, detect when changing the url
* back and forward set a new url
* store history as a constantly growing list


 */

import React, {Component} from 'react';
import {HBox, VBox} from "appy-comps";
import {Input, Toolbar} from './GUIUtils'
import RemoteDB from "./RemoteDB"

export default class Browser extends Component {
    constructor(props) {
        super(props);
        this.db = new RemoteDB("browser");
        this.db.connect();

        this.state = {
            url:'https://joshondesign.com/',
            history: [
                "https://joshondesign.com/"
            ]
        };

        this.navBack = () => {
        };

        this.navForward = () => {
        };

        this.load = (e) => {
            // var location = this.refs.iframe.contentWindow.location;
            // console.log("loaded", this.refs.iframe, this.refs.iframe.contentWindow, this.refs.iframe.src);
            // console.log("doc = ", this.refs.iframe.contentDocument);
            // console.log("location",location);
            // console.log("event",e);
            // console.log("body", this.refs.iframe.contentWindow.document);
        };

    }
    render() {
        return <VBox grow>
            <Toolbar>
                <button className="fa fa-arrow-left" onClick={this.navBack}/>
                <button className="fa fa-arrow-right" onClick={this.navForward}/>
                <Input db={this.db} value={this.state.url} style={{flex:1}}/>
            </Toolbar>
            <HBox grow>
                <iframe title="fake browser" ref="iframe" src={this.state.url} style={{flex:1}} onLoad={this.load}/>
            </HBox>
        </VBox>
    }
}
