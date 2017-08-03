import React, { Component } from 'react';
import './App.css';
import FakeWindow from "./FakeWindow";
import "font-awesome/css/font-awesome.css";
import Alarms from "./Alarms";
import {HBox, VBox, PushButton, CheckButton, Scroll, ListView} from "./GUIUtils";
//import {DB} from "./Database";
import MusicPlayer from "./MusicPlayer";
import Contacts from "./Contacts";
import Todos from "./Todo";

import RemoteDB from "./RemoteDB";

const DB = new RemoteDB();

const Launcher = (props) => {
    return <VBox style={{
        position:'absolute',
        right:10,
        top:10,
    }
    } className="launcher">
        <button onClick={()=>props.app.startApp("Alarms",<Alarms db={DB}/>)} className="fa fa-clock-o"></button>
        <button onClick={()=>props.app.startApp("Music",<MusicPlayer db={DB}/>)} className="fa fa-music"></button>
        <button onClick={()=>props.app.startApp("Contacts",<Contacts db={DB}/>)} className="fa fa-address-book"></button>
        <button onClick={()=>props.app.startApp("Todo List",<Todos db={DB}/>)} className="fa fa-list"></button>
    </VBox>
};

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apps:[]
        };
        DB.on('connect',(m)=>{
            console.log("fully connected",m);
            this.setState({apps:[{ title:'Alarms 1', app: <Alarms db={DB}/>}]});
        });
        DB.connect();
    }
    startApp(title, app) {
        var apps = this.state.apps.slice();
        apps.push({title:title,app:app});
        this.setState({apps:apps});
    }
  render() {
    return (
        <VBox>
            {this.state.apps.map((a,i)=><FakeWindow title={a.title} key={i}>{a.app}</FakeWindow>)}
            <Launcher app={this}/>
        </VBox>
    );
  }

}

export default App;
