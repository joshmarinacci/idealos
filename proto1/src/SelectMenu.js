import React, {Component} from "react";

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
    return <div style={{ ...menuItemStyle,  ...override}} onClick={()=>props.onClick(props.item)}
    >{text}</div>
};

export default class SelectMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            highlightedIndex: 0,
            items:[],
        };

        this.mounted = false;
        this.updateItems = (data) => {
            if(!this.mounted) return;
            this.setState({items:data});
        };
        props.query.on('update', this.updateItems);
        props.query.on('execute', this.updateItems);



        this.navDown = () => {
            let index = this.state.highlightedIndex;
            while(true) {
                index = (index + 1) % this.state.items.length;
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
                if(index < 0) index = this.state.items.length -1;
                var item = this.getItem(index);
                if(item.disabled) continue;
                break;
            }
            this.setState({highlightedIndex: index});
        };
        this.choose = () => {
            const item = this.getItem(this.state.highlightedIndex);
            if(this.props.onSelect) this.props.onSelect(item,this.state.highlightedIndex);
        };
        this.documentKeydown = (e) => {
            if(e.keyCode === 40) {
                e.stopPropagation();
                e.preventDefault();
                this.navDown()
            }
            if(e.keyCode=== 38) {
                e.stopPropagation();
                e.preventDefault();
                this.navUp()
            }
            if(e.keyCode === 13) {
                this.choose();
            }
        };
        this.clickChoose = (item) => {
            console.log("item",item);
            if(this.props.onSelect) this.props.onSelect(item);
        }
    }
    getItem(index) {
        return this.state.items[index];
    }

    componentDidMount() {
        document.addEventListener('keydown',this.documentKeydown,true);
        this.mounted = true;
        this.props.query.execute();
    }
    componentWillUnmount() {
        document.removeEventListener('keydown',this.documentKeydown,true);
        this.mounted = false;
    }

    render() {
        return <div style={menuStyle} ref="div">
            {this.state.items.map((it,i)=>{
                return <SelectItemTemplate key={i} item={it} highlighted={this.state.highlightedIndex === i} template={this.props.template}
                                           onClick={this.clickChoose}
                />
            })}
        </div>
    }
}