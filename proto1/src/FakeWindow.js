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
            this.setState({down:true})
        };
        this.mouseUp = () => {
            this.setState({down:false});
        };
        this.mouseMove = (e) => {
            if(!this.state.down) return;
            this.setState({x:e.screenX-80, y:e.screenY-65});
        }
    }
    render() {
        const style = {
            top:this.state.y,
            left:this.state.x
        };
        return <div className="window"
        style={style}>
            <header onMouseDown={this.mouseDown}
                    onMouseMove={this.mouseMove}
                    onMouseUp={this.mouseUp}
            >{this.props.title}</header>
            {this.props.children}
        </div>
    }
}