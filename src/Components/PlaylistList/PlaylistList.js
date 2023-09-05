import React from 'react';
import PlaylistItem from '../PlaylistItem/PlaylistItem';
import './PlaylistList.css';

class PlaylistList extends React.Component{



    render(){
        return(

            <div className="PlaylistList">
                <h2>User Playlists</h2>
                {
                this.props.playlists.map(playlist => {
                    return <PlaylistItem playlist ={playlist} playlistName= {playlist.name} playlistStatus={this.props.playlistStatus} key= {playlist.id} onRefresh={this.props.onRefresh} onSelect={this.props.onSelect} onPlaylistChange={this.props.onPlaylistChange} onNameChange = {this.props.onNameChange} onSwitchPlaylist={this.props.onSwitchPlaylist}/>
                })
            }
            </div>          
        )
    }

}

export default PlaylistList;