import React, {Component} from "react"

export var CheckButton = ((props) => <input type="checkbox" checked={props.value}/>);
export let PushButton = ((props) => <button onClick={props.onClick}>{props.children}</button>);
export let Scroll = ((props) => <div style={{overflow:"scroll", flex:1}}>{props.children}</div>);


export class ListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[]
        }
        props.model.on('update',(data)=>{console.log("updated data",data);this.setState({data:data})});
        props.model.on('execute',(data)=>{console.log("executed data",data);this.setState({data:data})});
        props.model.execute();
    }
    render() {
        let Template = this.props.template;
        return <div
            className="ListView"
            style={{
                border:'0px solid gray',
                minWidth:'100px',
                minHeight:'100px',
                backgroundColor:'#fff',
                flex:1
            }}
        >{this.state.data.map((item, i)=> {
                var sel = (this.props.selected === item);
                return <div
                    className="ListItem"
                    style={{backgroundColor:sel?'lightBlue':'#fff'}}
                    key={i}
                    onClick={()=>this.props.onSelect(item)}
                ><Template item={item}
                           onSelect={this.props.onSelect}
                           selected={this.props.selected}

                /></div>
            }
        )}</div>
    }
}

export let Input = ((props)=>{
    let copied = (e) => {
        var text = e.target.value.substring(e.target.selectionStart, e.target.selectionEnd);
        props.db.sendMessage({
            type:'clipboard',
            target:'system',
            command:'copy',
            payload:text
        });
    };

    return <input type="text"  onCopy={copied} {...props}/>
});