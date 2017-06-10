import React, { Component } from 'react';
import './App.css';


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


 # Contacts List

 contacts_list is query all docs type == contact
 contacts_view is hbox
 vbox
 searchbox <= app.filter
 list <= contacts_list filterby app.filter
 vbox
 hbox
 label: selected.first
 label: selected.last
 hbox
 label: selected.company
 vbox
 selected.phones => map (contact)
 hbox
 label: phone.type
 label: phone.number
 vbox
 selected.addresses => map (address)
 hbox
 label: address.type
 label: address.street
 hbox
 label: address.city
 label: address.state
 label: address.zip



 mp3_artist_names <= query all docs type === song, unique by artist_id, artist_id
 mp3_artist_list  <= query all docs type === song_artist where id in mp3_artist_names
 mp3_artist_view  <= listview, model <= mp3_artist_list
 mp3_albums_list  <= query all docs song_album where id in (all where type === song, unique by album_id) where artist == mp3_artist_view.selected.id
 mp3_albums_view  .model <= mp3_albums_list
 mp3_songs_list   <= query all docs where type == song, album == mp3_albums_view.selected.id

 hbox
 hbox
 prev
 play:  playing <= mp3_songs_list.selected, player.play(playing)
 next
 vbox
 label: playing.song
 label: (query all artist where (id == playing.artist_id)).name
 label: (query all album where (id == playing.album_id)).name

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

class LiveQuery {
    constructor(desc, db) {
        this.db = db;
        this.desc = desc;
        this.cbs = [];
    }
    on(type,cb) {
        this.cbs.push(cb);
    }
    matches(doc) {
        if(doc.type == this.desc.type) return true;
        return false;
    }
    update(data) {
        var d2 = data.filter((d)=>d.type == this.desc.type);
        this.cbs.forEach((cb)=>cb(d2));
    }
    execute() {
        return this.db.docs.filter((d)=>d.type == this.desc.type);
    }
}
class LiveDatabase {
    constructor() {
        this.docs = [];
        this.queries = [];
    }
    makeLiveQuery(desc) {
        var q = new LiveQuery(desc,this);
        this.queries.push(q);
        return q;
    }
    insert(doc) {
        this.docs.push(doc);
        this.queries.forEach((q)=> {
            if(q.matches(doc)) {
                q.update(this.docs);
            }
        })
    }
}

/*
 # alarms app
    alarm {
        time: minutes (rendered as hours and minutes)
        enabled: boolean
        name: string
        repeat: array: string
        type: alarm
    }
    items = query all docs type == alarm, ordered by time
vbox
    hbox
        push_button: insert new alarm
    scroll listview: items
        template(item)
            check_button <= item.enabled
            label: item.title
            label: floor(item.time/60) + item mod 60
            label: repeatToString(item.repeat)
*/

var VBox = ((props)=>{
    return <div style={{
        display:'flex',
        flexDirection:'column',
        border:'1px solid #ddd',
    }}>
        {props.children}
    </div>
});
var HBox = ((props)=>{
    return <div style={{
        display:'flex',
        flexDirection:'row',
        border:'1px solid #ddd',
    }}>
        {props.children}
    </div>
});

var CheckButton = ((props) => <input type="checkbox" value={props.value}/>);
let PushButton = ((props) => <button onClick={props.onClick}>{props.children}</button>);
let Scroll = ((props) => <div style={{overflow:"scroll"}}>{props.children}</div>);

class ListView extends Component {
    render() {
        let Template = this.props.template;
        return <div>{this.props.model.map((item, i)=> <Template key={i} item={item}/>)}</div>
    }
}

var DB = new LiveDatabase();

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
    }
].forEach((doc)=>DB.insert(doc));

let AlarmTemplate = ((props) => {
    var item = props.item;
    return <HBox>
        <CheckButton/>
        <label>{item.title}</label>
        <label>{Math.floor(item.time/60)+ ':' + item.time % 60}</label>
        <label>{item.repeat.join("")}</label>
    </HBox>
});

class Alarms extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alarms:[]
        };
        this.query = DB.makeLiveQuery({type:'alarm'}, {order:{time:true}});
        this.query.on('update',(data)=>this.setState({alarms:data}));
        this.state.alarms = this.query.execute();
        this.createAlarm = () => {
            var alarm = {
                type:'alarm',
                time: 60*6,
                enabled: true,
                name: 'unnamed alarm',
                repeat: ['none']
            };
            DB.insert(alarm);
        }
    }
    render() {
        return <VBox>
            <HBox>
                <PushButton onClick={this.createAlarm} className="fa fa-plus">+</PushButton>
            </HBox>
            <Scroll>
                <ListView model={this.state.alarms} template={AlarmTemplate}/>
            </Scroll>
        </VBox>
    }
}


class App extends Component {
  render() {
    return (
      <VBox>
          <Alarms/>
          <Alarms/>
      </VBox>
    );
  }
}

export default App;
