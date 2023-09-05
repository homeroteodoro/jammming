import React from 'react';
import Spotify  from '../../util/Spotify';
import './PlaylistItem.css';

class PlaylistItem extends React.Component{
    constructor(props){
        super(props);

        this.handleClick = this.handleClick.bind(this);

    }


    handleClick(e){

        this.props.onSwitchPlaylist();
        let playlistId = this.props.playlist.id;
        this.props.onRefresh(playlistId);
        //console.log("voy con el array");
        //console.log(playlistId);
        Spotify.getPlaylist(playlistId).then(response => {

            response.map(track => {this.props.onSelect(track)});
            });
            this.props.onPlaylistChange(this.props.playlistName);
           
        }
           

    render() {
        return(
            //will print the name from the props passed to the component.
            <div className='PlaylistItem'>

                <h3 onClick={this.handleClick}>{this.props.playlistName}</h3>

            </div>
            
        )
    }
}

export default PlaylistItem;