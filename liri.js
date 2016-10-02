
//Load npm modules and twitter keys js file
var twitter_keys = require("./keys.js");
var twitter = require("twitter");
var spotify = require("spotify");
var request = require("request");
var inquirer = require("inquirer");
var fs = require("fs");

//Twitter Function
function getTwitter(handle){

	//Search using Twitter module
	var client = new twitter(twitter_keys.twitterKeys);
	var params = {screen_name: handle, count:"20"};
	client.get("statuses/user_timeline", params, function(err, tweets, response) {
  		if (!err) {
  			var outputStr="";
    		tweets.forEach(function(value, index){
    			outputStr+=("Tweet #"+(index+1)+"\nCreated: "+value.created_at+"\nMessage: ");
    			var messageArr = value.text.split(" ");
    			var lengthCount =0;
    			messageArr.forEach(function(value2){
    				lengthCount+=value2.length+1; //length of word plus a space
    				
    				//If length of line exceeds 60 chars, create new line
    				if(lengthCount>60){  
    					outputStr+="\n\t ";
    					lengthCount=0;
    				}
    				if(value2!=="\n"){ //Catch new lines
    					outputStr+=value2+" ";
    				}
    			});
    			outputStr+="\n\n";
    		});
    		logText(outputStr);
  		}
  		else{

  			logText("There was a Twitter problem:\n"+JSON.stringify(err));
  		}

  		run();//Show main menu
	});
}

//Spotify function
function getSong(song){

	//If no selection, create default song
	var songName = "\""+song+"\"";
	if(song === ""){
		songName = "\"The Sign\"";
	}

	//Search using spotify module
	spotify.search({ type: "track", query: songName}, function(err, info) {
    
	    if ( err ) {
	        logText("There was a Spotify problem:\n"+JSON.stringify(err));
	    }
	    else{
	    	//Check to make sure something was returned
	    	if(info.tracks.items.length> 0){
		    	var outputStr="Here are the top 5 songs that are called "+songName+":\n";
		    	//Picked top 5 songs as default. There can be the same song title by different artists
		    	for(var i=0;i<5;++i){
		    		outputStr += "Artist: "+ info.tracks.items[i].artists[0].name+"\n"+
		    					"Song: "+ info.tracks.items[i].name+"\n"+
		    					"Album: "+ info.tracks.items[i].album.name+"\n"+
		    					"Link: "+ info.tracks.items[i].preview_url+"\n\n";
		      	}
		      	logText(outputStr);
		    }
		    else{
		    	logText("Cannot find an artist with that song name...");
		    }
	    }

	    run(); //Show main menu
	});
}

//OMDB, RottenTomatoes function
function getMovie(movie){
	//If no selection, create default movie
	var movieName = movie;
	if(movie === ""){
		movieName = "Mr. Nobody";
	}


	//ADD ROTTEN TOMATOES INFO HERE WHEN RECEIVED!!!!!!!!!


	//Search OMDB using the request module
	request("http://www.omdbapi.com/?t="+movieName+"", function (err, response, info) {
		if (!err && response.statusCode == 200) {
			var movieObj = JSON.parse(info);
			if (movieObj.Response != "False"){
				var outputStr = "Title: "+ movieObj.Title+"\n"+
								"Year: "+ movieObj.Year+"\n"+
								"Plot: "+ movieObj.Plot+"\n"+
								"Actors: "+ movieObj.Actors+"\n"+
								"IMDB Rating: "+ movieObj.imdbRating+"\n"+
								"Country: "+ movieObj.Country+"\n"+
								"Language: "+ movieObj.Language;

				logText(outputStr);
			}
			else{
				logText("Cannot find Movie...");
			}

			run();//Show main menu
		}
		
		else{
			logText("There was a OMDB problem:\n"+JSON.stringify(err));

		}
	});

}

function random(){
	fs.readFile("random.txt", "utf8", function(err, data) {
		if(err){
			logText("There was a problem reading file:\n"+err);
		}
		else{
			var dataArr = data.split("\n");

			var lineNum = Math.floor(Math.random()*(dataArr.length-1)); //Get random number based on number of lines in file
			var queryArr = dataArr[lineNum].split(",");
			
			//Run random function based on random number
			switch(queryArr[0]){

				case "my-tweets":
					getTwitter(queryArr[1]);
					break;
				case "spotify-this-song":
					getSong(queryArr[1]);
					break;
				case "movie-this":
					getMovie(queryArr[1]);
					break;
			}
		}
	});
}

//Log function
function logText(logStr){

	//Show, log everything to screen
	console.log(logStr);

	//Log everything to file
	fs.appendFile("./log.txt", logStr+"\n", function(err){
		if(err){
			console.log("There was a problem logging to textfile:\n"+err);
		}
	}); 
}

//Main Menu Prompt
function run(){

	inquirer.prompt([
		{
			type: "list",
			message: "What kind of information would you like?",
			name: "menu",
			choices: ["Twitter", "Spotify", "Movies", "Surprise Me", "Exit"]
		}
	]).then(function (menu) {
		
		//Twitter selection
		if(menu.menu === "Twitter"){
			//Twitter prompt
			inquirer.prompt([
				{
					type: "list",
					message: "What tweets would you like to see?",
					name: "person",
					choices: ["Eric", "Hillary Clinton", "Donald Trump", "Gary Johnson", "Jill Stein"]
				}
			]).then(function (person) {

				//Switch to see which twitter account will be selected
				var handle;
				switch(person.person){
					case "Eric":
						handle="CPUHobbes";
						break;
					case "Hillary Clinton":
						handle="HillaryClinton";
						break;
					case "Donald Trump":
						handle="realDonaldTrump";
						break;
					case "Gary Johnson":
						handle="GovGaryJohnson";
						break;
					case "Jill Stein":
						handle="DrJillStein";
						break;
				}
				//Function to get tweets
				getTwitter(handle);
			});

		}

		//Spotify selection
		else if(menu.menu === "Spotify"){

			//Spotify prompt
			inquirer.prompt([
			{
				type: "input",
				message: "What is the name of a song you want to know about?",
				name: "song"
			}
			]).then(function (song) {
				//Function to get song information
				getSong(song.song);
			});
		}

		//OMDB and Rotten Tomatoes selection
		else if(menu.menu === "Movies"){

			//Movie title prompt
			inquirer.prompt([

			{
				type: "input",
				message: "What is the name of the movie you want to know about?",
				name: "movie"
			}
			]).then(function (movie) {

				//Function to get movie information
				getMovie(movie.movie);
				
	 		});
	 	}

	 	//Random main menu pick
		else if(menu.menu === "Surprise Me"){
			//Function to run random Twitter, Spotify, or OMDB function
			random();
		}

		//Exit app
		else if (menu.menu === "Exit"){
			logText("Goodbye!!");
		}

		//Error Catchall
		else {
			logText("Error in Selection");
		}

	});
}

//Run main app
run();