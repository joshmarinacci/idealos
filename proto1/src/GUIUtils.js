import React, {Component} from "react"

export var CheckButton = ((props) => <input type="checkbox" checked={props.value} onChange={props.onChange}/>);
export let PushButton = ((props) => <button onClick={props.onClick}>{props.children}</button>);
export let Scroll = ((props) => <div style={{overflow: "scroll", flex: 1}}>{props.children}</div>);


export class ListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
        if(props.model) {
            props.model.on('update', (data) =>  this.setState({data: data}));
            props.model.on('execute', (data) => this.setState({data: data}));
            props.model.execute();
        }

        this.onSelect = (item) => {
            if(this.props.onSelect) this.props.onSelect(item)
        }
    }

    render() {
        let Template = this.props.template;
        return <div
            className="ListView"
            style={{
                border: '0px solid gray',
                minWidth: '100px',
                minHeight: '100px',
                backgroundColor: '#fff',
                flex: 1
            }}
        >{this.state.data.map((item, i) => {
                var sel = (this.props.selected === item);
                return <div
                    className="ListItem"
                    style={{backgroundColor: sel ? 'lightBlue' : '#fff'}}
                    key={i}
                    onClick={() => this.onSelect(item)}
                ><Template item={item}
                           onSelect={()=>this.onSelect(item)}
                           selected={this.props.selected}
                           model={this.props.model}
                /></div>
            }
        )}</div>
    }
}

export let Input = ((props) => {
    var {db, ...rest} = props;
    let copied = (e) => {
        var text = e.target.value.substring(e.target.selectionStart, e.target.selectionEnd);
        db.sendMessage({
            type: 'clipboard',
            target: 'system',
            command: 'copy',
            payload: text
        });
    };

    return <input type="text" onCopy={copied} {...rest}/>
});