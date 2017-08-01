import React, { Component } from 'react';
import './App.css';
import FakeWindow from "./FakeWindow";
import "font-awesome/css/font-awesome.css";
import Alarms from "./Alarms";
import {HBox, VBox, PushButton, CheckButton, Scroll, ListView} from "./GUIUtils";
import {DB} from "./Database";
import MusicPlayer from "./MusicPlayer";
import Contacts from "./Contacts";


/*
 email client

 folder_list_query = query all docs where type is mail_folder, order by name
 folder_list_view is view, bound to folder_list_query
 mail_list_query = query all docs where type is email, folder is in folder_list_view.selected, order by date
 mail_list_view is view, bound to mail_list_query
 mail_list_view.title <= mail_list_query.title
 mail_item_view is view, query all docs where id = bound to mail_list_view.selected.id
 mail_item_view is vbox
 hbox
 label: to
 label: <= model.to
 hbox
 label: from
 label: <= model.from
 hbox
 label: subject
 label: <= model.subject
 scrollbox
 htmlview: <= model.content
 main_view is vbox
 hbox
 button: new edit_view
 hbox
 scrollbox
 folder_list_view
 scrollbox
 mail_list_view
 scrollbox
 mail_item_view



 edit_view is vbox
 hbox
 label: to
 tagbox <= model.to, query all docs type==contact
 hbox
 label: subject
 textline <= model.subject
 scrollbox
 richtextview: <= model.content

*/

/*
 # Todo List

 items = query all docs type == todo_item, ordered by position
    vbox
        hbox
            push_button: insert new type==todo_item
        scroll listview
            template(item)
                check_button <= item.completed
                text_line    <= item.title
                text_area    <= item.description
                tag_box      <= item.tags, query all docs type == todo_item, union item.tags, unique by tag,
*/


[
    {
        type:'alarm',
        time: 60*8+30,
        enabled:false,
        name:'wake up',
        repeat:['none']
    },
    {
        type:'email',
        from:'Nigerian Prince',
        subject:'A fortune you have inherited',
        content: {
            mimeType:'text/plain',
            text:"Dear sirs"
        }
    },
    {
        type:'artist',
        name:'Erasure'
    },
    {
        type:'artist',
        name:'Depeche Mode'
    },
    {
        type:'artist',
        name:'Cars'
    },

    {
        type:'album',
        name:'Chorus',
        artist:'Erasure'
    },
    {
        type:'album',
        name:'Wild!',
        artist:'Erasure'
    },
    {
        type:'album',
        name:'Some Great Reward',
        artist:'Depeche Mode'
    },

    {
        type:'song',
        name:'Joan',
        album:'Chorus'
    },
    {
        type:'song',
        name:'Perfect Stranger',
        album:'Chorus'
    },
    {
        type:'song',
        name:'Blue Savannah',
        album:'Wild!'
    },
    {
        type:'contact',
        first:'Josh',
        last:'Marinacci',
        address:[
            {
                street:'4055 Eddystone Place',
                city:'Eugene',
                state:'OR',
                zip:'97404'
            }
        ],
        email: [ 'joshua@marinacci.org','me@silly.io']
    },
    {
        type:'contact',
        first:'Bob',
        last:'Robinson',
        email:['bobrob@gmail.com'],
        address:[]
    },
    {
        type:'contact',
        first:'Josh',
        last:'Jackson',
        address:[],
        email:[]
    }


].forEach((doc)=>DB.insert(doc));




let TodoTemplate = ((props)=>{

});
class Todos extends Component {

    render() {
        return <VBox>
            <HBox>
                <PushButton onClick={this.createTodo} className='fa fa-plus'>+</PushButton>
            </HBox>
            <Scroll>
                <ListView model={this.query} template={TodoTemplate}/>
            </Scroll>
        </VBox>
    }
}

const Launcher = (props) => {
    return <VBox style={{
        position:'absolute',
        right:10,
        top:10,
    }
    } className="launcher">
        <button onClick={()=>props.app.startApp("Alarms",<Alarms/>)} className="fa fa-clock-o"></button>
        <button onClick={()=>props.app.startApp("Music",<MusicPlayer/>)} className="fa fa-music"></button>
        <button onClick={()=>props.app.startApp("Contacts",<Contacts/>)} className="fa fa-address-book"></button>
    </VBox>
};
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apps:[
                { title:'Alarms 1', app: <Alarms/>},
                { title:'Alarms 2', app: <Alarms/>}
            ]
        }
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
            {/*<Todos/>*/}
            <Launcher app={this}/>
        </VBox>
    );
  }
}

export default App;
