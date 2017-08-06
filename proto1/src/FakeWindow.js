import React, { Component } from 'react';

export default class FakeWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            x:200,
            y:200,
            down:false
        };
        this.mouseDown = () => {
            this.listener = (e) => {
                this.setState({x:e.clientX-20, y:e.clientY-15});
            };
            this.up_listener = (e) => {
                document.removeEventListener('mousemove',this.listener);
                document.removeEventListener('mouseup',this.up_listener);
            };
            document.addEventListener('mousemove',this.listener);
            document.addEventListener('mouseup', this.up_listener);
        };
    }
    render() {
        const style = {
            top:this.state.y,
            left:this.state.x,
            userSelect:'none',
            cursor:'move'
        };
        return <div className="window"
        style={style}>
            <header onMouseDown={this.mouseDown}
            >{this.props.title}</header>
            {this.props.children}
        </div>
    }
}