
// pokemondb.net data webcrawler
// downloads data from pokemondb.net into a json file

let request = require('request');

let pokemonData = {};
let url = 'https://pokemondb.net/pokedex/';
getGames(url);
// TODO get location data
// TODO get move data
// TODO get ability data

// TODO download pokemon images


function getPokemonData(pokemon) {
	//console.log(pokemon);
}

function getLocationData() {
}


function getPokemon(game) {

	let urlAddition;
	if (game) {
		urlAddition = 'game/' + game + '/';
	}
	else {
		urlAddition = 'national/';
	}

	request(
		{ uri: url + urlAddition },
		function(error, response, body) {
			keyword = 'infocard-list';
			index = body.search(keyword);
			body = body.slice(index);

			if (game) {
				pokemonData.games[game].pokemon = [];
			}
			else {
				pokemonData.pokemon = [];
			}

			keyword = 'name" href=\"/pokedex/';
			while (body.search(keyword) != -1) {
				index = body.search(keyword);
				body = body.slice(index + keyword.length);
				index = body.search('\"');
				let pokemon = body.slice(0, index);
				if (game) {
					pokemonData.games[game].pokemon.push(pokemon);
				}
				else {
					pokemonData.pokemon.push(pokemon);
				}
			}

			if (!game) {
				console.log(pokemonData);
				// TODO get individual pokemon data
				for (let i = 0; i < pokemonData.pokemon.length; i++) {
					getPokemonData(pokemonData.pokemon[i]);
				}
			}
		}
	);
}


function getGames(url) {
	request(
		{ uri: url },
		function(error, response, body) {

			let keyword = 'national dex';
			let index = body.search(keyword);
			body = body.slice(index);

			// get all pokemon games
			pokemonData.games = {};
			
			keyword = '/pokedex/game/';
			while (body.search(keyword) != -1) {
				index = body.search(keyword);
				body = body.slice(index + keyword.length);
				index = body.search('\"');
				let game = body.slice(0, index);
				pokemonData.games[game]= {};
			}

			for (game in pokemonData.games) {
				getPokemon(game);
			}

			// get national dex
			getPokemon();
		}
	);
}
