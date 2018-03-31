import React, {Component} from "react"
import {HBox, VBox, Spacer} from "appy-comps";
import {Input, ListView, Scroll, Toolbar} from './GUIUtils'
import RemoteDB from "./RemoteDB";

export default class FileViewer extends Component {
    constructor(props) {
        super(props);

        this.db = new RemoteDB("files");
        this.db.connect();

        this.state = {
            files:[]
        }
    }
    render() {
        return <VBox grow>
            <Toolbar>
                <button className="fa fa-table"  onClick={()=>this.setState({"view":"grid"})}/>
                <button className="fa fa-th-list" onClick={()=>this.setState({"view":"list"})}/>
                <Spacer/>
                <Input className='search' db={this.db}/>
            </Toolbar>
            <div className="email-app-grid">
                <ul className="source-list" style={{borderWidth:'0 1px 0 0'}}>
                    <li>Places</li>
                    <ul>
                        <li>Photos</li>
                        <li>Documents</li>
                        <li>Trash</li>
                    </ul>
                    <li>Queries</li>
                    <ul>
                        <li className="selected">Recent</li>
                        <li>All By Date</li>
                        <li>All MP3s</li>
                        <li>tag == special</li>
                    </ul>
                </ul>
                <div>
                    {this.renderFiles(this.state.files)}
                </div>
            </div>
        </VBox>
    }

    renderFiles(files) {
        return "files here"
    }
}