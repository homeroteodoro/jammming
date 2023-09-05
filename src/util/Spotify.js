const clientId = "e3b050d2f1a74f639f9c2c69c1943b56";
const redirectUri = "http://localhost:3000";
let accessToken;
let userId;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    //check for access token match
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }

  },

  getUserID(){
    return fetch(`https://api.spotify.com/v1/me`, {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }}).then(response => {
        if(response.ok){
            let jsonResponse = response.json();
            return jsonResponse
        } 
    }).then(jsonResponse => {          
        userId = jsonResponse.id;
        return userId;
    })

},


  search(term) {
    const accessToken = Spotify.getAccessToken();

    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: { Authorization: `Bearer ${accessToken}` },

    })
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        
        if (!jsonResponse.tracks) {
          return [];
        }
        return jsonResponse.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
        }));
      });
  },
  
  savePlaylist(name, trackUris, playlistID) {
    if (!name || !trackUris.length) {
      return;
    }
    //let playlistID;
    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    //let userId;

    
    if(!playlistID){
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: headers,
          method: "POST",
          body: JSON.stringify({ name: name }),
        })
          .then((response) => response.json())
          .then((jsonResponse) => {
            const playlistId = jsonResponse.id;
            return fetch(
              `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
              {
                headers: headers,
                method: "POST",
                body: JSON.stringify({ uris: trackUris }),
              }
            );
          });
      };
  },

  getUserPlaylists(){

    const accessToken = Spotify.getAccessToken();

    let headers = {
        'Authorization': 'Bearer ' + accessToken
    };

    return fetch('https://api.spotify.com/v1/me/playlists', {
        headers: headers,
        
    }).then(response => {
        let jsonResponse = response.json();
        return jsonResponse;
    }).then(jsonResponse => {
        let fullArray = jsonResponse.items;
        let userPlaylists = fullArray.filter(playlist => playlist.owner.id === userId);
        //console.log(fullArray);
        //console.log(userPlaylists);
        return userPlaylists;
    });
},

getPlaylist(playlistId){
  let headers = {
      'Authorization': 'Bearer ' + accessToken
  };

  return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {headers: headers}).then(
      response => {
      let jsonResponse = response.json();
      return jsonResponse}).then(
      jsonResponse => {
      let array = jsonResponse.items.map(item => {return {
          name: item.track.name,
          artist: item.track.artists[0].name,
          album: item.track.album.name,
       id: item.track.id,
          uri: item.track.uri
      }
      });

      return array;

  })
}, 

deleteTrack(playlistId, track){
  let headers = {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
  };

  let trackURI = track.uri;
  let bodyText = JSON.stringify({tracks:{uri: trackURI}})
  //console.log(trackURI);
  //console.log(bodyText);

  fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,{
      method: 'DELETE',
      headers: headers,
      body: JSON.stringify({tracks:[{uri: trackURI}]}),
  }).then(response => {
      let jsonResponse = response.json()
      console.log("la respuesta es --->  "+ jsonResponse);
      return jsonResponse;
  })

}

};

export default Spotify;