import React, {Component} from 'react';
import {HBox, VBox, Spacer} from "appy-comps";
import {Scroll} from "./GUIUtils";
import {SPECIAL_DOCS} from "./Constants";
import RemoteDB from "./RemoteDB"

const STYLES = {
    LIST_ITEM: {
        border: '1px solid lightGray',
        borderWidth: '0 0 1px 0'
    },
    TRANSPARENT_BUTTON : {
        borderWidth: 0,
        backgroundColor: 'transparent',
        color:'gray'
    }
}


const ClipTemplate = (props) => {
    const clss = props.item.pinned ? "fa fa-star" : "fa fa-star-o";
    return <HBox style={STYLES.LIST_ITEM}>
        {props.item.text}
        <Spacer/>
        <button className={clss} onClick={() => props.onPin(props.item)} style={STYLES.TRANSPARENT_BUTTON}/>
    </HBox>
};

class MultiSelectionListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };

        const {model, onSelectionChange, ...rest} = props;
        this.delgateProperties = rest;
        if (model) {
            model.on('update', (data) => this.setState({data: data}));
            model.on('execute', (data) => this.setState({data: data}));
            model.execute();
        }

        this.onSelect = (e, item) => {
            if (!onSelectionChange) return;
            if (!e.shiftKey) return onSelectionChange([item]);

            let oldSelection = this.props.selection.slice();
            const n = oldSelection.indexOf(item);
            if (n >= 0) {
                oldSelection.splice(n, 1);
            } else {
                oldSelection.push(item);
            }
            onSelectionChange(oldSelection);
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
        >{this.state.data.map((item, i) => this.renderItem(item, i))}</div>
    }

    renderItem(item, i) {
        var Template = this.props.template;
        var selected = (this.props.selection.indexOf(item) >= 0);
        return <div
            className="ListItem"
            style={{backgroundColor: selected ? 'lightBlue' : '#fff'}}
            key={i}
            onClick={(e) => this.onSelect(e, item)}
        ><Template item={item}
                   onSelect={() => this.onSelect(item)}
                   selected={this.props.selection}
                   model={this.props.model}
                   {...this.delgateProperties}
        /></div>
    }
}

export default class ClipboardViewer extends Component {
    constructor(props) {
        super(props);
        this.db = new RemoteDB("clipboard-viewer");
        this.db.connect();
        this.state = {
            selection: []
        };
        this.clips = this.db.makeLiveQuery({type: 'clip'});

        this.selectionChanged = (selection) => {
            this.setState({selection: selection});
            this.db.update({
                id: SPECIAL_DOCS.CURRENT_CLIPBOARD_SELECTION,
                clips: selection.map((clip) => clip.id)
            })
        };

        this.showAll = () => {
            this.clips.updateQuery({type: 'clip'});
        };
        this.showPinned = () => {
            this.clips.updateQuery({type: 'clip', pinned: true});
        };
        this.clipPin = (clip) => {
            clip.pinned = !clip.pinned;
            this.db.update(clip);
        }
    }

    render() {
        return <VBox grow>
            <HBox>
                <button onClick={this.showAll}>all</button>
                <button onClick={this.showPinned}>pinned</button>
            </HBox>
            <Scroll style={{border: '1px solid lightGray', flex:1}}>
                <MultiSelectionListView model={this.clips}
                                        selection={this.state.selection}
                                        template={ClipTemplate}
                                        onSelectionChange={this.selectionChanged}
                                        onPin={this.clipPin}
                />
            </Scroll>
        </VBox>
    }
}
