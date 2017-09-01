import React, {Component} from 'react';
import {VBox, HBox, Spacer} from "appy-comps";
import DragAction from "./DragAction";
import RemoteDB from "./RemoteDB";
import Transition from 'react-transition-group/Transition';

const duration = 250;

const defaultStyle = {
    transition: `transform ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`,

};

const transitionStyles = {
    entering: { opacity: 0, transform: 'scale(1.3)' },
    entered:  { opacity: 1, transform: 'scale(1)'},
    exiting:  { opacity: 1, transform: 'scale(1)'},
    exited:   { opacity: 0, transform: 'scale(1.3)'}
};

const Fade = ({ in: inProp, children, onDone }) => (
    <Transition in={inProp} timeout={0}  appear  addEndListener={node =>  node.addEventListener('transitionend', onDone,false)}>
        {(state) => (
            <div style={{
                ...defaultStyle,
                ...transitionStyles[state]
            }}>
                {children}
            </div>
        )}
    </Transition>
);
export default class FakeWindow extends Component {
    constructor(props) {
        super(props);

        this.db = new RemoteDB("fakewindow");
        this.db.connect();
        this.state = {
            down: false,
            action: null,
            open:true,
        };
        this.moveHandler = (action) => {
            const a = this.props.app;
            this.props.onMove(a, a.x+action.delta.x, a.y + action.delta.y);
        };
        this.resizeHandler = (action) => {
            const a = this.props.app;
            this.props.onResize(a, a.w+action.delta.x, a.h + action.delta.y);
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
        this.fadeWindow = () => {
            this.setState({open:false});
        };
        this.closeWindow = (node,done) => {
            if(this.state.open) return;
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
            if (msg.width) this.props.onResize(this.props.app, msg.width, this.props.app.h);
            if (msg.height) this.props.onResize(this.props.app, this.props.app.w, msg.height);
        });
    }

    render() {
        const style = {
            top: this.props.app.y,
            left: this.props.app.x,
            width: this.props.app.w,
            height: this.props.app.h,
        };

        return(
            <Transition in={this.state.open} timeout={0} appear addEndListener={node => node.addEventListener('transitionend', this.closeWindow, false)}>
                {(state) => (
                <VBox className="window" style={{
                    ...style,
                    ...defaultStyle,
                    ...transitionStyles[state]
                }}>
                    <HBox onMouseDown={this.mouseDown} style={{userSelect: 'none', cursor: 'move'}} className="header">
                        {this.props.title}
                        <Spacer/>
                        <button className="fa fa-close" onClick={this.fadeWindow}/>
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
                    )}
            </Transition>
        )
    }

    componentWillReceiveProps(newProps) {
    }
}