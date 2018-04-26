import React, {Component} from "react"
import {HBox, VBox, Spacer} from "appy-comps";
import {Input, ListView, Scroll, Toolbar} from './GUIUtils'
import RemoteDB from "./RemoteDB";

export default class FileViewer extends Component {
    constructor(props) {
        super(props);

        this.db = new RemoteDB("files");
        this.db.connect();
        this.files = this.db.makeLiveQuery({})
        this.files.openFile = (file) => {
            if(file.type === 'note') {
                this.db.sendMessage({
                    type:'command',
                    target: 'system',
                    command: "open",
                    withApp: 'texteditor',
                    withFile:file.id
                });
            }
        }

        this.state = {
            view: 'grid',
            sources: [
                {
                    title: 'Places',
                    type: 'header'
                },
                {
                    title: 'Photos',
                    type: 'source',
                },
                {
                    type:'source',
                    title:'Documents'
                },
                {
                    type:'source',
                    title:'trash'
                },
                {
                    title:'Queries',
                    type:'header'
                },
                {
                    type:'source',
                    title:'Recent'
                },
                {
                    type:'source',
                    title:'All By Date'
                },
                {
                    type:'source',
                    title:'All MP3s'
                },
                {
                    type:'source',
                    title:'tag == special'
                },
            ]
        }

        this.db.whenConnected(()=>{
            this.db.sendMessage({
                type:'command',
                target: 'system',
                command: "resize",
                appid: this.props.appid,
                width:700,
                height:350
            });
        })




    }
    render() {
        return <VBox grow>
            <Toolbar>
                <button className="fa fa-table"  onClick={()=>this.setState({"view":"grid"})}/>
                <button className="fa fa-th-list" onClick={()=>this.setState({"view":"list"})}/>
                <Spacer/>
                <Input className='search' db={this.db}/>
            </Toolbar>
            <div className="grid-2">
                {this.renderSourceList(this.state.sources)}
                {this.renderFileList(this.files,this.state.view)}
            </div>
        </VBox>
    }

    renderSourceList(sources) {
        const srcs = sources.map((s,i)=>{
            const sty = {
                padding:'0.25em',
            }
            if(s.type === 'header') {
                sty.backgroundColor = 'gray'
                sty.color = 'white';
                sty.fontWeight = 'bold'
            }
            return <li key={i} style={sty}>{s.title}</li>
        })
        return <ul style={{
            backgroundColor:'lightGray',
            margin:0,
            padding:0,
        }}
        >{srcs}</ul>
    }

    renderFileList(files, view) {
        if(view === 'grid') {
            return <ListView model={files} template={FileIconTemplate} className="listview-grid"/>
        }
        return <ListView model={files} template={FileListItemTemplate}/>
    }
}

const chooseIcon = (type) => {
    if(type === 'system') return 'fa-gears'
    if(type === 'event') return 'fa-calendar'
    if(type === 'alarm') return 'fa-clock-o'
    if(type === 'song') return 'fa-file-audio-o'
    if(type === 'contact') return 'fa-address-card-o'
    if(type === 'note') return 'fa-file-text-o'
    if(type === 'image') return 'fa-file-image-o'
    if(type === 'email') return 'fa-envelope-o'
    if(type === 'message') return 'fa-comment-o'
    if(type === 'clip') return 'fa-paste'
    if(type === 'script') return 'fa-code'
    if(type === 'todo') return 'fa-list-ul'
    if(type === 'folder') return 'fa-folder-o'
    return 'fa-file-o'
}

function openFile(file) {
    console.log("opening the file",file)
}
const FileIconTemplate = (props) => {
    return <VBox className="file" onDoubleClick={()=>props.model.openFile(props.item)}>
        <i className={` file-icon fa ${chooseIcon(props.item.type)}`}/>
        {props.item.type}
    </VBox>
}

const FileListItemTemplate = (props) => {
    return <HBox>
        <b>{props.item.type}</b>
        <i>item</i>
        </HBox>
}
