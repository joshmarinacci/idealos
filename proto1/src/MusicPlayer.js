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

import React, {Component} from "react"
import {VBox, HBox, PushButton, CheckButton, ListView, Scroll} from "./GUIUtils";
import {DB} from "./Database";

let ArtistTemplate = ((props) => <label>{props.item.name}</label>);
let AlbumTemplate = ((props) => <label>{props.item.name}</label>);
let SongTemplate = ((props) => <label>song {props.item.name}</label>);

export default class MusicPlayer extends Component {
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
