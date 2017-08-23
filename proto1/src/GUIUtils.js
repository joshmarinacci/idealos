import React, {Component} from "react"

export var CheckButton = ((props) => <input type="checkbox" checked={props.value} onChange={props.onChange}/>);
export let PushButton = ((props) => <button onClick={props.onClick}>{props.children}</button>);
export let Scroll = ((props) => <div style={{overflow: "scroll", flex: 1}}>{props.children}</div>);
export let SimpleTemplate = ((props) => <div>{props.item.toString()}</div>);

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
        var Template = this.props.template;
        if(!this.props.template) {
            Template = SimpleTemplate;
        }
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


    var lastid = 0;
    var target = null;
    db.on('clipboard', (msg) => {
        if(msg.command === 'respond-clip' && msg.requestid === lastid) {
            const pst = msg.payload.map((clip)=>clip.text).join("");
            const txt = target.value;
            const start = target.selectionStart;
            const end = target.selectionEnd;
            target.value = txt.substring(0, start) + pst + txt.substring(end, txt.length);
            target.selectionStart = start+pst.length;
            target.selectionEnd = target.selectionStart;
        }
    });

    let copied = (e) => {
        e.preventDefault();
        var text = e.target.value.substring(e.target.selectionStart, e.target.selectionEnd);
        db.sendMessage({
            type: 'clipboard',
            target: 'system',
            command: 'copy',
            payload: text
        });
    };

    let pasted = (e) => {
        e.preventDefault();
        console.log("pasted",e, e.type);
        lastid = Math.floor(Math.random()*100000);
        e.persist();
        target = e.target;
        db.sendMessage({
            type:'clipboard',
            target:'system',
            command:'request-clip',
            requestid:lastid,
        })
    };

    let cutted = (e) => {
        e.preventDefault();
        var text = e.target.value.substring(e.target.selectionStart, e.target.selectionEnd);
        console.log("redirecting cut");
        db.sendMessage({
            type: 'clipboard',
            target: 'system',
            command: 'cut',
            payload: text
        });
    };

    return <input type="text" onCopy={copied} onPaste={pasted} onCut={cutted} {...rest}/>
});