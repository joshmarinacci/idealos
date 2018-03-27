import React, {Component} from "react"
import {ListView, Scroll, Input} from "./GUIUtils";
import {HBox, VBox, Spacer} from "appy-comps";
import RemoteDB from "./RemoteDB"

let ArtistTemplate = ((props) => <div>{props.item.name}</div>);
let AlbumTemplate = ((props) => <div>{props.item.name}</div>);
let SongTemplate = ((props) => <div>{props.item.name}</div>);

export default class MusicPlayer extends Component {
    constructor(props) {
        super(props);
        this.db = new RemoteDB("musicplayer");
        this.db.connect();

        this.artists = this.db.makeLiveQuery({type:'artist'});
        this.albums = this.db.makeLiveQuery({type:'album'});
        this.songs = this.db.makeLiveQuery({type:'song'});

        this.state = {
            selectedArtist:{name:'none'},
            queryText:"",
            selectedAlbum:{name:'none'},
            selectedSong:{name:'none',album:'none'},
            playing:false,
        };

        this.selectArtist = (artist) => {
            this.setState({selectedArtist:artist});
            this.albums.updateQuery({type:'album', artist:artist.name});
        };
        this.selectAlbum = (album) => {
            this.setState({selectedAlbum:album});
            this.songs.updateQuery({album:album.name});
        };
        this.selectSong = (song) => {
            this.setState({selectedSong:song})
        };

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


        this.audio = new Audio();
        this.playPause = () => {
            if(!this.state.selectedSong.url) return;
            if(this.audio.paused) {
                this.audio.src = this.state.selectedSong.url;
                this.audio.play();
                this.setState({playing:true});
            } else {
                this.audio.pause();
                this.setState({playing:false});
            }
        };


        this.db.listenMessages((msg)=>{
            if(msg.type === 'audio' && msg.command === 'toggle-play') {
                this.playPause();
            }
        });

        this.typeQuery = (e) => {
            const txt = e.target.value;
            this.setState({queryText:txt});
            this.artists.updateQuery({type:'artist', name:{$regex:txt, $options:'i'}});
            this.albums.updateQuery({type:'album', $or:[
                {name:{$regex:txt, $options:'i'}},
                {artist:{$regex:txt, $options:'i'}},
            ]});
        }
    }

    render() {
        return <VBox grow>

            <HBox
                style={{
                    background: 'linear-gradient(to bottom, #dddddd, #aaaaaa)',
                    alignItems: 'center',
                }}>

                <HBox id="play-controls">
                    <button id="prev" className="fa fa-backward borderless"></button>
                    <button onClick={this.playPause} className={this.state.playing?"fa fa-pause":"fa fa-play"}/>
                    <button id="next" className="fa fa-forward borderless"></button>
                </HBox>
                <input type="range"/>
                <span className="spacer"></span>

                <VBox style={{
                    fontSize: '90%',
                    fontWeight:400,
                    borderRadius:'1em',
                    backgroundColor: '#0be',
                    padding: '0.5em 2em',
                    color: 'white',
                    alignItems: 'center',
                    margin: '0.25em'
                }}>

                    <span>{this.state.selectedSong.name}</span>
                    <span>{this.state.selectedArtist.name} - {this.state.selectedAlbum.name}</span>
                </VBox>
                <Spacer/>
                <div>
                    <Input onChange={this.typeQuery} db={this.db} value={this.state.queryText}/>
                </div>
            </HBox>
            <HBox className="tool-bar">
                <button>Library</button>
                <button>Radio</button>
                <button>Store</button>
            </HBox>

            <div className="email-app-grid">
                    <ListView
                        model={this.artists}
                        template={ArtistTemplate}
                        onSelect={this.selectArtist}
                        selected={this.state.selectedArtist}
                    />
                    <ListView
                        model={this.albums}
                        template={AlbumTemplate}
                        onSelect={this.selectAlbum}
                        selected={this.state.selectedAlbum}
                    />
                    <ListView
                        model={this.songs}
                        template={SongTemplate}
                        onSelect={this.selectSong}
                        selected={this.state.selectedSong}
                    />
            </div>
        </VBox>;
    }
}
