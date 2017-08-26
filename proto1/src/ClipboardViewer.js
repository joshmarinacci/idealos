import React, {Component} from 'react';
import {HBox} from "appy-comps";
import {Scroll} from "./GUIUtils";
import {SPECIAL_DOCS} from "./Constants";
import RemoteDB from "./RemoteDB"

const ClipTemplate = ((props)=><div>{props.item.text}</div>);

class MultiSelectionListView extends Component {
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

        this.onSelect = (e,item) => {
            if(!this.props.onSelectionChange) return;
            if(!e.shiftKey) return this.props.onSelectionChange([item]);

            let oldSelection = this.props.selection.slice();
            const n = oldSelection.indexOf(item);
            if(n>=0) {
                oldSelection.splice(n,1);
            } else {
                oldSelection.push(item);
            }
            this.props.onSelectionChange(oldSelection);
        }
    }
    render() {
        return <div style={{
                border: '0px solid gray',
                minWidth: '100px',
                minHeight: '100px',
                backgroundColor: '#fff',
                flex: 1
            }}
        >{this.state.data.map((item, i) => this.renderItem(item,i))}</div>
    }

    renderItem(item, i) {
        var Template = this.props.template;
        var selected = (this.props.selection.indexOf(item) >= 0);
        return <div
            className="ListItem"
            style={{backgroundColor: selected ? 'lightBlue' : '#fff'}}
            key={i}
            onClick={(e) => this.onSelect(e,item)}
        ><Template item={item}
                   onSelect={()=>this.onSelect(item)}
                   selected={this.props.selection}
                   model={this.props.model}
        /></div>
    }
}

export default class ClipboardViewer extends Component {
    constructor(props) {
        super(props);
        this.db = new RemoteDB("clipboard-viewer");
        this.db.connect();
        this.state = {
            selection:[]
        };
        this.clips = this.db.makeLiveQuery({type: 'clip'});

        this.selectionChanged = (selection) => {
            this.setState({selection:selection});
            this.db.update({
                id:SPECIAL_DOCS.CURRENT_CLIPBOARD_SELECTION,
                clips:selection.map((clip)=>clip.id)
            })
        };
    }

    render() {
        return <HBox grow>
            <Scroll>
                <MultiSelectionListView model={this.clips}
                                        selection={this.state.selection}
                                        template={ClipTemplate}
                                        onSelectionChange={this.selectionChanged}
                />
            </Scroll>
        </HBox>

    }
}
