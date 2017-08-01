import React, {Component} from "react"


export var VBox = ((props)=>{
    return <div style={{
        display:'flex',
        flexDirection:'column',
        border:'1px solid #ddd',
    }}
                {...props}
    >
        {props.children}
    </div>
});
export var HBox = ((props)=>{
    return <div style={{
        display:'flex',
        flexDirection:'row',
        border:'1px solid #ddd'
    }}
                {...props}
    >
        {props.children}
    </div>
});

export var CheckButton = ((props) => <input type="checkbox" checked={props.value}/>);
export let PushButton = ((props) => <button onClick={props.onClick}>{props.children}</button>);
export let Scroll = ((props) => <div style={{overflow:"scroll"}}>{props.children}</div>);


export class ListView extends Component {
    constructor(props) {
        super(props);
        props.model.on('update',(data)=>{this.setState({data:data})});
        this.state = {
            data:props.model.execute()
        }
    }
    render() {
        let Template = this.props.template;
        return <div
            style={{
                border:'1px solid gray',
                minWidth:'100px',
                minHeight:'100px'
            }}
        >{this.state.data.map((item, i)=> {
                var sel = (this.props.selected === item);
                return <div
                    style={{backgroundColor:sel?'lightBlue':'#eee'}}
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
