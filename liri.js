
//Load npm modules and twitter keys js file
var twitter_keys = require('./keys.js');
var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var inquirer = require('inquirer');

run();

// Create a "Prompt" with a series of questions.
function run(){

	inquirer.prompt([

		// Here we create a basic text prompt.
		{
			type: "list",
			message: "What kind of information would you like?",
			name: "menu",
			choices: ["Twitter", "Spotify", "Movies", "Surprise Me", "Exit"]
		}
	]).then(function (menu) {
		

		// If we log that user as a JSON, we can see how it looks.
		//console.log(JSON.stringify(user, null, 2));
		if(menu.menu === "Twitter"){

		}

		else if(menu.menu === "Spotify"){

			inquirer.prompt([

			// Here we create a basic text prompt.
			{
				type: "input",
				message: "What is the name of a song you want to know about?",
				name: "song",
			}
			]).then(function (song) {
				spotify.search({ type: 'track', query: song.song }, function(err, info) {
			    
				    if ( err ) {
				        console.log("There was a problem:\n"+error);
				    }
				    else{
			    		var outputStr = "Artist: "+ info.tracks.items[0].artists[0].name+"\n"+
			    			"Song: "+ info.tracks.items[0].name+"\n"+
			    			"Album: "+ info.tracks.items[0].album.name+"\n"+
			    			"Link: "+ info.tracks.items[0].preview_url+"\n";

			    		console.log(outputStr);
				    }
				    run();
				});
			});
		}
		else if(menu.menu === "Movies"){
			inquirer.prompt([

			// Here we create a basic text prompt.
			{
				type: "input",
				message: "What is the name of the movie you want to know about?",
				name: "movie",
			}
			]).then(function (movie) {

				//ADD ROTTEN TOMATOES INFO HERE WHEN RECEIVED!!!!!!!!!


				request('http://www.omdbapi.com/?t='+movie.movie+"", function (error, response, info) {
		  			if (!error && response.statusCode == 200) {
		  				var movieObj = JSON.parse(info);
		  				if (movieObj.Response != "False"){
			  				var outputStr = "Title: "+ movieObj.Title+"\n"+
			  								"Year: "+ movieObj.Year+"\n"+
			  								"Plot: "+ movieObj.Plot+"\n"+
			  								"Actors: "+ movieObj.Actors+"\n"+
			  								"IMDB Rating: "+ movieObj.imdbRating+"\n"+
			  								"Country: "+ movieObj.Country+"\n"+
			  								"Language: "+ movieObj.Language;

			  				console.log(outputStr);
			  			}
			  			else{
			  				console.log("Cannot find Movie...");
			  			}
			  			run();
	 				}
	 				
	 				else{
	 					console.log("There was a problem:\n"+error);

	 				}
	 			});
	 		});
	 	}

		else if(menu.menu === "Surprise Me"){

		}
		else if (menu.menu === "Exit"){
			console.log("Goodbye!!");
		}
		else {
			console.log("Error in Selection");
		}

	});
}