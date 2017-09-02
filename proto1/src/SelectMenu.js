import React, {Component} from "react";
import {VBox} from "appy-comps";

const menuStyle = {
    border: '1px solid black',
    padding: '0.5em 0',
    borderRadius: '0.5em',
    backgroundColor:'white'

};

const menuItemStyle = {
    border: '0px solid blue',
    padding: '0.25em'
};

const SelectItemTemplate = (props) => {
    let override = {
        color:'black',
        backgroundColor:'white'
    };
    if(props.highlighted) {
        override.color = 'white';
        override.backgroundColor = "#4466ff";
    }
    if(props.item.disabled) {
        override.color = 'black';
        override.backgroundColor = 'gray';
    }
    var text = props.item.toString();
    if(props.template) {
        text = props.template(props.item);
    }
    return <div style={{ ...menuItemStyle,  ...override}}
    >{text}</div>
};

export default class SelectMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            highlightedIndex: 0,
        };

        this.keyDown = (e) => {
            // console.log("pressed",e.keyCode);
            if(e.keyCode === 40) return this.navDown();
            if(e.keyCode === 38) return this.navUp();
            if(e.keyCode === 13) return this.choose();
        };

        this.navDown = () => {
            let index = this.state.highlightedIndex;
            while(true) {
                index = (index + 1) % this.props.items.length;
                var item = this.getItem(index);
                if(item.disabled) continue;
                break;
            }
            this.setState({highlightedIndex:index});
        };
        this.navUp = () => {
            let index = this.state.highlightedIndex;
            while(true) {
                index = (index -1 );
                if(index < 0) index = this.props.items.length -1;
                var item = this.getItem(index);
                if(item.disabled) continue;
                break;
            }
            this.setState({highlightedIndex: index});
        };
        this.choose = () => {
            const item = this.getItem(this.state.highlightedIndex);
            if(this.props.onSelect) this.props.onSelect(item,this.state.highlightedIndex);
        }
    }
    getItem(index) {
        return this.props.items[index];
    }

    componentDidMount() {
        console.log("shown");
        this.refs.div.focus();
    }

    render() {
        return <div style={menuStyle} onKeyDown={this.keyDown} tabIndex={1} ref="div">
            {this.props.items.map((it,i)=>{
                return <SelectItemTemplate key={i} item={it} highlighted={this.state.highlightedIndex === i} template={this.props.template}/>
            })}
        </div>
    }
}