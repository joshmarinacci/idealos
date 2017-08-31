import React, {Component} from 'react';
import {VBox, HBox, Spacer} from "appy-comps";
import DragAction from "./DragAction";
import RemoteDB from "./RemoteDB";

export default class FakeWindow extends Component {
    constructor(props) {
        super(props);

        this.db = new RemoteDB("fakewindow");
        this.db.connect();
        this.state = {
            w: 300,
            h: 200,
            down: false,
            action: null,
        };
        this.moveHandler = (action) => {
            var a = this.props.app;
            this.props.onMove(a, a.x+action.delta.x, a.y + action.delta.y);
        };
        this.resizeHandler = (action) => {
            this.setState({
                w: this.state.w + action.delta.x,
                h: this.state.h + action.delta.y
            })
        };
        this.mouseDown = (e) => {
            this.db.sendMessage({
                type: 'command',
                target: 'system',
                command: "raise",
                appid: this.props.appid,
            });
            this.setState({action: new DragAction(e, this.moveHandler)});
        };
        this.resizeDown = (e) => this.setState({action: new DragAction(e, this.resizeHandler)});
        this.closeWindow = (e) => {
            this.db.sendMessage({
                type: 'command',
                target: 'system',
                command: "close",
                appid: this.props.appid,
            });
        };


        //handler for resize messages
        this.db.listenMessages((msg) => {
            if (msg.type !== 'command') return;
            if (msg.command !== 'resize') return;
            if (msg.appid !== this.props.appid) return;
            if (msg.width) this.setState({w: msg.width});
            if (msg.height) this.setState({h: msg.height});
        });
    }

    render() {
        const style = {
            top: this.props.app.y,
            left: this.props.app.x,
            width: this.state.w,
            height: this.state.h,
        };
        return <VBox className="window" style={style}>
            <HBox onMouseDown={this.mouseDown} style={{userSelect: 'none', cursor: 'move'}} className="header">
                {this.props.title}
                <Spacer/>
                <button className="fa fa-close" onClick={this.closeWindow}/>
            </HBox>
            <VBox grow scroll>
                {this.props.children}
            </VBox>
            <HBox className="footer">
                <Spacer/>
                <button className="fa fa-arrows-alt"
                        style={{
                            cursor: 'nwse-resize'
                        }}
                        onMouseDown={this.resizeDown}/>
            </HBox>
        </VBox>
    }
}