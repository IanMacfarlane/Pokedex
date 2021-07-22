
// pokemondb.net data webcrawler
// downloads data from pokemondb.net into a json file

let request = require('request');

let pokemonData = {};
let url = 'https://pokemondb.net/pokedex/';
getGames(url);


function getPokemon(game) {
	request(
		{ uri: url + 'game/' + game + '/' },
		function(error, response, body) {
			keyword = 'infocard-list';
			index = body.search(keyword);
			body = body.slice(index);

			pokemonData.games[game].pokemon = [];

			keyword = 'name" href=\"/pokedex/';
			while (body.search(keyword) != -1) {
				index = body.search(keyword);
				body = body.slice(index + keyword.length);
				index = body.search('\"');
				let pokemon = body.slice(0, index);
				//console.log(pokemon);
				pokemonData.games[game].pokemon.push(pokemon);
			}

			console.log(pokemonData);
			console.log(pokemonData.games[game].pokemon);
			
		}
	);
}


function getGames(url) {
	request(
		{ uri: url },
		function(error, response, body) {

			// get all pokemon games

			let keyword = '<strong>National Dex</strong>';
			let index = body.search(keyword);
			body = body.slice(index);

			pokemonData.games = {};
			
			keyword = '/pokedex/game/';
			while (body.search(keyword) != -1) {
				index = body.search(keyword);
				body = body.slice(index + keyword.length);
				index = body.search('\"');
				let game = body.slice(0, index);
				pokemonData.games[game]= {};
			}

			/*for (game in pokemonData.games) {
				getPokemon(game);
			}*/
			getPokemon('firered-leafgreen');
		}
	);
}
