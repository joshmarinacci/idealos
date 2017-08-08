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
import {ListView, Scroll, Input} from "./GUIUtils";
import {HBox, VBox, Spacer} from "appy-comps";

let ArtistTemplate = ((props) => <label>{props.item.name}</label>);
let AlbumTemplate = ((props) => <label>{props.item.name}</label>);
let SongTemplate = ((props) => <label>{props.item.name}</label>);

export default class MusicPlayer extends Component {
    constructor(props) {
        super(props);
        this.artists = props.db.makeLiveQuery(
            {type:'artist'},
            {order:{name:true}}
        );
        this.albums = props.db.makeLiveQuery(
            {type:'album'},
            {order:{name:true}}
        );
        this.songs = props.db.makeLiveQuery(
            {type:'song'},
            {order:{name:true}}
        );

        this.state = {
            selectedArtist:{name:'none'},
            selectedAlbum:{name:'none'},
            selectedSong:{name:'none',album:'none'},
            playing:false,
        };

        this.selectArtist = (artist) => {
            this.setState({selectedArtist:artist});
            this.albums.updateQuery({artist:artist.name});
        };
        this.selectAlbum = (album) => {
            this.setState({selectedAlbum:album});
            this.songs.updateQuery({album:album.name});
        };
        this.selectSong = (song) => {
            this.setState({selectedSong:song})
        };

        this.props.db.sendMessage({
            type:'command',
            target: 'system',
            command: "resize",
            appid: this.props.appid,
            width:700,
            height:350
        });


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

        }
    }

    render() {
        return <VBox grow>
            <HBox>
                <button disabled className="fa fa-backward"/>
                <button onClick={this.playPause} className={this.state.playing?"fa fa-pause":"fa fa-play"}/>
                <button disabled className="fa fa-forward"/>
                <label>{this.audio.duration}</label>
                <VBox>
                    <label>{this.state.selectedSong.name}</label>
                    <label>{this.state.selectedArtist.name}</label>
                    <label>{this.state.selectedAlbum.name}</label>
                </VBox>
                <Spacer/>
                <div>
                    <Input/>
                </div>
            </HBox>
            <HBox grow>
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
