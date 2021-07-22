
// pokemondb.net data webcrawler
// downloads data from pokemondb.net into a json file

let request = require('request');

let url = 'https://pokemondb.net/pokedex';

let pokemonData = {};

request(
	{ uri: url },
	function(error, response, body) {

		// TODO get all pokemon games

		let keyword = '<strong>National Dex</strong>';
		let index = body.search(keyword);
		body = body.slice(index);

		pokemonData.games = [];
		
		keyword = '/pokedex/game/';
		while (body.search(keyword) != -1) {
			index = body.search(keyword);
			body = body.slice(index + keyword.length);
			index = body.search('\"')
			pokemonData.games.push(body.slice(0, index));
		}

		console.log(pokemonData);
		
	}
);

