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
        this.filter = (d) => {
            var valid = true;
            Object.keys(this.desc).forEach((key) => {
                if(this.desc[key] !== d[key]) valid = false;
            });
            return valid;
        }
    }
    updateQuery(desc) {
        Object.keys(desc).forEach((key)=>{
            this.desc[key] = desc[key];
            //remove keys
            if(!desc[key] || desc[key].length === 0) delete this.desc[key];
        });
        this.update(this.db.docs);
    }
    on(type,cb) {
        this.cbs.push(cb);
    }
    matches(doc) {
        return this.filter(doc);
    }
    update(data) {
        var d2 = data.filter(this.filter);
        this.cbs.forEach((cb)=>cb(d2));
    }
    execute() {
        return this.db.docs.filter(this.filter);
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
    }}
        {...props}
    >
        {props.children}
    </div>
});
var HBox = ((props)=>{
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

var CheckButton = ((props) => <input type="checkbox" value={props.value}/>);
let PushButton = ((props) => <button onClick={props.onClick}>{props.children}</button>);
let Scroll = ((props) => <div style={{overflow:"scroll"}}>{props.children}</div>);

class ListView extends Component {
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
        this.query = DB.makeLiveQuery({type:'alarm'}, {order:{time:true}});
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
                <ListView model={this.query} template={AlarmTemplate}/>
            </Scroll>
        </VBox>
    }
}


/*
 mp3_artist_names <= query all docs
        type === song,
        unique by artist_id
        pick artist_id
 mp3_artist_list  <= query all docs
    type === song_artist
    where id in mp3_artist_names
 mp3_artist_view  <= listview, model <= mp3_artist_list
 mp3_albums_list  <= query all docs
    song_album where id in (all where type === song, unique by album_id)
    where artist == mp3_artist_view.selected.id
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
let ArtistTemplate = ((props) => <label>{props.item.name}</label>);
let AlbumTemplate = ((props) => <label>{props.item.name}</label>);
let SongTemplate = ((props) => <label>song {props.item.name}</label>);

class MusicPlayer extends Component {
    constructor(props) {
        super(props);
        this.artists = DB.makeLiveQuery(
            {type:'artist'},
            {order:{name:true}}
        );
        this.albums = DB.makeLiveQuery(
            {type:'album'},
            {order:{name:true}}
        );
        this.songs = DB.makeLiveQuery(
            {type:'song'},
            {order:{name:true}}
        );

        this.state = {
            selectedArtist:{name:'Depeche Mode'},
            selectedAlbum:{name:'none'},
            selectedSong:{name:'none',album:'none'}
        };

        this.selectArtist = (artist) => {
            this.setState({selectedArtist:artist});
            this.albums.updateQuery({artist:artist.name});
        };
        this.selectAlbum = (album) => {
            this.setState({selectedAlbum:album});
            this.songs.updateQuery({album:album.name})
        };
        this.selectSong = (song) => {
            this.setState({selectedSong:song})
        };
    }

    render() {
        return <VBox>
            <HBox>
                <button>prev</button>
                <button>play/pause</button>
                <button>next</button>
                <VBox>
                    <label>{this.state.selectedSong.name}</label>
                    <label>{this.state.selectedArtist.name}</label>
                    <label>{this.state.selectedAlbum.name}</label>
                </VBox>
            </HBox>
        <HBox>
            <Scroll>
                <ListView
                    model={this.artists}
                    template={ArtistTemplate}
                    onSelect={this.selectArtist}
                    selected={this.state.selectedArtist}
                />
            </Scroll>
            <Scroll>
                <ListView
                    model={this.albums}
                    template={AlbumTemplate}
                    onSelect={this.selectAlbum}
                    selected={this.state.selectedAlbum}
                />
            </Scroll>
            <Scroll>
                <ListView
                    model={this.songs}
                    template={SongTemplate}
                    onSelect={this.selectSong}
                    selected={this.state.selectedSong}
                />
            </Scroll>
        </HBox>
            </VBox>;
    }
}

/*
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



 */

let ContactTemplate = ((props) => <label>{props.item.first} {props.item.last}</label>);
let ContactView = ((props) => {
    var c = props.contact;
    if(!c) return <VBox></VBox>;
    return <VBox>
        <label>{c.first} {c.last}</label>
        {c.address.map((addr,i) => {
            return <VBox key={i}>
                <HBox><label>{addr.street}</label></HBox>
                <HBox><label>{addr.city}</label>
                <label>{addr.state}</label>
                    <label>{addr.zip}</label>
                </HBox>
            </VBox>
        })}
    </VBox>
});

class Contacts extends Component {
    constructor(props) {
        super(props);
        this.contacts = DB.makeLiveQuery({
            type:'contact'
        });
        this.state = {
            selectedContact: null,
            searchQuery:''
        };
        this.selectContact = (contact) => {
            this.setState({selectedContact:contact});
        };
        this.typeQuery = () => {
            let query = this.refs.search.value;
            this.setState({searchQuery:query});
            this.contacts.updateQuery({type:'contact',first:query})
        }
    }
    render() {
        return <VBox>
            <HBox>
                <input ref='search' onChange={this.typeQuery}
                       value={this.state.searchQuery}/>
            </HBox>
            <HBox>
                <Scroll>
                    <ListView model={this.contacts}
                              template={ContactTemplate}
                              onSelect={this.selectContact}
                              selected={this.state.selectedContact}/>
                </Scroll>
                <ContactView contact={this.state.selectedContact}/>
            </HBox>
        </VBox>
    }
}
class App extends Component {
  render() {
    return (
      <VBox>
          <HBox>
          <Alarms/>
          <Alarms/>
          </HBox>
          <MusicPlayer/>
          <Contacts/>
      </VBox>
    );
  }
}

export default App;
