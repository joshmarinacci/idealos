
import React, {Component} from 'react';
import FakeWindow from "./FakeWindow";
import {VBox, PopupContainer} from "appy-comps";
import {APP_REGISTRY, SPECIAL_DOCS} from "./Constants";

import Launcher from "./Launcher";
import RemoteDB from "./RemoteDB";
import CommandBar from "./CommandBar";
import NotificationViewer from "./NotificationViewer";

import './App.css';
import "font-awesome/css/font-awesome.css";



class App extends Component {
    constructor(props) {
        super(props);
        this.DB = new RemoteDB('master');
        this.state = {
            apps: [],
            connected: false,
        };
        this.DB.on('connect', (m) => {
            console.log("fully connected", m);
            this.setState({connected: true})
        });
        this.DB.on("receive", (m) => {
            console.log("got a message back", m);
        });
        this.DB.listenMessages((msg)=>{
            // console.log("message came in",msg);
            if(msg.type==='command') {
                if(msg.command === 'launch') return this.launch(msg);
                if(msg.command === 'close') return this.close(msg);
                if(msg.command === 'raise') return this.raise(msg);
                if(msg.command === 'enter-fullscreen') return this.enterFullscreen();
                if(msg.command === 'enter-overview') return this.enterOverview();
            }
        });
        this.DB.connect();


        this.DB.on('clipboard', (msg) => {
            // console.log("got a clipboard command",msg);
            if(msg.command === 'copy' || msg.command === 'cut') {
                //store new clippings into the database
                this.DB.insert({
                    type: 'clip',
                    text: msg.payload
                }).then((doc)=>{
                    // console.log("the new doc is",doc);
                    this.DB.update({
                        id:SPECIAL_DOCS.CURRENT_CLIPBOARD_SELECTION,
                        clips:[doc.id]
                    })
                });
            }
            if(msg.command === 'request-clip') {
                this.DB.query({id:SPECIAL_DOCS.CURRENT_CLIPBOARD_SELECTION}).then((docs)=>{
                    var clip = docs[0];
                    // console.log("got the docs",clip);
                    // console.log("must load the clips",clip.clips);
                    Promise.all(clip.clips.map((c)=>{
                        return this.DB.query({id:c}).then((docs)=>docs[0])
                    })).then((clips)=>{
                        // console.log("lst clips = ", clips);

                        this.DB.sendMessage({
                            type:'clipboard',
                            target:'system',
                            command:'respond-clip',
                            payload:clips,
                            requestid:msg.requestid
                        });
                    });
                });
            }
        });

        this.moveAppWindow = (app,x,y) => {
            app.x = x;
            app.y = y;
            this.setState({apps:this.state.apps.slice()});
        }
    }

    nextId() {
        if (!this.id) this.id = 0;
        this.id++;
        return this.id;
    }

    launch(msg) {
        var apps = this.state.apps.slice();
        if (!APP_REGISTRY[msg.app]) {
            console.log("unknown app", msg.app);
            return;
        }
        const info = APP_REGISTRY[msg.app];
        const AppComponent = info.app;
        const appid = this.nextId();
        const appInstance = <AppComponent appid={appid}/>;
        apps.push({title: info.title,
            appid: appid,
            app: appInstance,
            x:200,
            y:100,
        });
        this.setState({apps: apps});
        this.DB.insert({
            type: 'notification',
            read: false,
            title: 'launched ' + msg.app
        });

    }

    close(msg) {
        this.setState({apps: this.state.apps.filter(a => a.appid !== msg.appid)});
    }

    raise(msg) {
        const last = this.state.apps[this.state.apps.length-1];
        if(last.appid === msg.appid) return; //don't raise the top window
        const app = this.state.apps.find((a => a.appid === msg.appid));
        const apps = this.state.apps.filter(a => a.appid !== msg.appid);
        apps.push(app);
        this.setState({apps:apps});
    }

    enterFullscreen() {
        console.log("we can enter fullscreen");
    }

    enterOverview() {
        this.state.apps.forEach((app,i)=>{
            app.x = i*100;
            app.y = i*100;
        });
        this.setState({apps:this.state.apps.slice()});
    }

    render() {
        if(!this.state.connected) return <VBox></VBox>;
        return (
            <VBox>
                {this.state.apps.map((a, i) => <FakeWindow title={a.title} key={a.appid} app={a}
                                                           appid={a.appid} onMove={this.moveAppWindow}>{a.app}</FakeWindow>)}
                <Launcher/>
                <CommandBar/>
                {this.renderNotificationViewer()}
                <PopupContainer/>
            </VBox>
        );
    }

    renderNotificationViewer() {
        if (this.state.connected) return <NotificationViewer/>
        return "not connected";
    }


    componentDidMount() {
        // console.log("app has mounted",document);
        document.addEventListener('keydown',(e)=>{
            // console.log("a key has been pressed", e.shiftKey, e.ctrlKey, e.altKey, e.metaKey, e.key);
            if(e.shiftKey && e.ctrlKey && e.key === 'P') {
                console.log("pressed control shift p");
                e.preventDefault();
                this.DB.sendMessage({
                    type:'audio',
                    target:'system',
                    command:'toggle-play',
                });
                this.DB.insert({
                    type: 'notification',
                    read: false,
                    title: 'toggle play/pause'
                });
            }
        });
    }
}

export default App;
