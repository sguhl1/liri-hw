const liri = {
  init: function() {
      require("dotenv").config();
      const spotifyKeys = require("./keys.js");
      const request = require("request");
      const moment = require("moment");
      const fs = require("fs");
      const Spotify = require('node-spotify-api');
      const spotify = new Spotify(spotifyKeys.spotify);

      const action = process.argv[2];
      let title = process.argv[3];
      for (i = 4; i < 10; i++) {
          if (process.argv[i] !== undefined || null) {
              title += " " + process.argv[i];
          } else {
              break
          }
      }
      this.getTask(action, title, spotify, title, request, moment, fs);
  },
  getTask: function (action, title, spotify, title, request, moment, fs) {
     
          switch (action) {
              case "concert-this":
                  liri.concert(title, request);
                  moment();
                  break;

              case "spotify-this-song":
                  if (title === undefined || null) {
                      title = "The-Sign";
                  }
                  liri.mySong(spotify, title);
                  break;
              case "movie-this":
                  if (title === undefined || null) {
                      title = "Mr. Nobody";
                  }
                  liri.myMovie(title, request)
                  break;
              case "do-what-it-says":
                  liri.doWhat(action, title, spotify, title, request, fs);
                  break;
              
              }
  },
  
  concert: function(artist, request, moment) {
      const queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
      artist = artist.split(' ').join('+');
      request(queryUrl, moment, function(err, response,body){
        if (err) {
          console.log('Error occurred: ' + err);
          return;
      }
        body = JSON.parse(body);
        for (var i =0; i< body.length; i++) {
          console.log(`
        ======= Concerts =======
        Venue Name: ${body[i].venue.name}
        Venue Location: 
        City: ${body[i].venue.city}
        Region:${body[i].venue.region}
        Country:${body[i].venue.country}
        Date: ${body[i].datetime}
        ======= Concerts =======
        `)
        }
        //Date: ${moment(body[i].datetime).format('L')}
      })
  },

  mySong: function(spotify, title) {
      spotify.search({
          type: 'track',
          query: title
      }, function(err, data) {
          if (err) {
              console.log('Error occurred: ' + err);
              return;
          }

          let song = data.tracks.items[0]
          console.log(`
          ======= Songs =======
          Song Title: ${song.name}
          Artist: ${song.artists[0].name}
          Album: ${song.album.name}
          Preview URL: ${song.preview_url}
          ======= Songs =======`)

      });
  },
  myMovie: function(title, request) {
      title = title.split(' ').join('+');
      var queryUrl = "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=40e9cece";
      request(queryUrl, function(err, data, body) {
          body = JSON.parse(body);
          if (body.Title === undefined) {
              console.log("?????");
          } else {
            console.log(`
            ======= Movies =======
            Title: ${body.Title}
            Release Year: ${body.Year}
            IMDB Rating: ${body.imdbRating}
            Rotten Tomatoes Rating: ${Ratings[1].Value}
            Production Country: ${body.Country}
            Language: ${body.Language}
            Plot: ${body.Plot}
            Actors: ${body.Actors}
            ======= Movies =======`)
              
          }
          

      })
  },
  doWhat: function(action, title, spotify, title, request, fs) {
      fs.readFile("random.txt", "utf8", function(err, data) {
          if (err) {
              console.log(err);
          } else {
              //console.log(data);
              let dataArr = data.split(",");
              action = dataArr[0];
              title = dataArr[1];
              liri.getTask(action, title, spotify, title, request, fs);
          }
      })
  }
}
liri.init();