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
        this.filter = (d) => {
            var keys = Object.keys(this.desc);
            for(let i=0; i<keys.length; i++) {
                var key = keys[i];
                if(this.desc[key] != d[key]) return false;
            }
            return true;
        }
    }
    updateQuery(desc) {
        this.desc = desc;
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
        return <div
            style={{
            border:'1px solid gray',
            minWidth:'100px',
            minHeight:'100px'
            }}
        >{this.props.model.map((item, i)=> {
                return <Template key={i} item={item}
                                 onSelect={this.props.onSelect}
                                 selected={this.props.selected}
                />
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
        this.query.on('update',(data)=>this.setState({alarms:data}));
        this.state = {
            alarms: this.query.execute()
        };
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
let ArtistTemplate = ((props) => {
    var artist = props.item;
    var onSelect = props.onSelect;
    var selected = props.selected;
    var sel = (artist === selected);
    return <HBox
    ><label onClick={()=>onSelect(artist)}
            style={{
                        backgroundColor:sel?'lightGray':'white'
                        }}
    >{artist.name}</label></HBox>
});
let AlbumTemplate = ((props) => {
    var album = props.item;
    var onSelect = props.onSelect;
    var selected = props.selected;
    var sel = (album === selected);
    return <HBox
    ><label onClick={()=>onSelect(album)}
            style={{
                        backgroundColor:sel?'lightGray':'white'
                        }}
    >{album.name}</label></HBox>
});
let SongTemplate = ((props) => {
    var song = props.item;
    var onSelect = props.onSelect;
    var selected = props.selected;
    var sel = (song === selected);
    return <HBox
    ><label onClick={()=>onSelect(song)}
            style={{
                        backgroundColor:sel?'lightGray':'white'
                        }}
    >song {song.name}</label></HBox>
});

class MusicPlayer extends Component {
    constructor(props) {
        super(props);
        this.artists = DB.makeLiveQuery(
            {type:'artist'},
            {order:{name:true}}
        );
        this.artists.on('update',(artists)=>this.setState({artists:artists}));

        this.state = {
            artists:this.artists.execute(),
            selectedArtist:{name:'Depeche Mode'},
            albums:[],
            selectedAlbum:{name:'none'},
            selectedSong:{name:'none',album:'none'},
            songs:[]
        };
        this.selectArtist = (artist) => {
            this.setState({selectedArtist:artist});
            this.albums.updateQuery({
                type:'album',
                artist:artist.name
            })
        };

        this.selectAlbum = (album) => {
            this.setState({selectedAlbum:album});
            this.songs.updateQuery({
                type:'song',
                album:album.name
            })
        };
        this.albums = DB.makeLiveQuery(
            {type:'album', artist:this.state.selectedArtist.name},
            {order:{name:true}}
        );
        this.albums.on('update',(albums)=>this.setState({albums:albums}));
        this.state.albums = this.albums.execute();


        this.selectSong = (song) => {
            this.setState({selectedSong:song})
        };
        this.songs = DB.makeLiveQuery(
            {type:'song',album:this.state.selectedAlbum.name},
            {order:{name:true}}
        );
        this.songs.on('update', (songs)=>this.setState({songs:songs}));
        this.state.songs = this.songs.execute();
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
                    model={this.state.artists}
                    template={ArtistTemplate}
                    onSelect={this.selectArtist}
                    selected={this.state.selectedArtist}
                />
            </Scroll>
            <Scroll>
                <ListView
                    model={this.state.albums}
                    template={AlbumTemplate}
                    onSelect={this.selectAlbum}
                    selected={this.state.selectedAlbum}
                />
            </Scroll>
            <Scroll>
                <ListView
                    model={this.state.songs}
                    template={SongTemplate}
                    onSelect={this.selectSong}
                    selected={this.state.selectedSong}
                />
            </Scroll>
        </HBox>
            </VBox>;
    }
}

class App extends Component {
  render() {
    return (
      <VBox>
          <Alarms/>
          <Alarms/>
          <MusicPlayer/>
      </VBox>
    );
  }
}

export default App;
