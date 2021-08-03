let pokemonData = require('./pokemonData.json');
let request = require('request');

let baseUrl = 'https://archives.bulbagarden.net/wiki/File:';
let url;
let nextUrl;

for (pokemon in pokemonData.pokemon) {
	url = pokemonData.pokemon[pokemon].number.national + pokemon.charAt(0).toUpperCase() + pokemon.slice(1) + '.png';

	// fix special cases TODO reginal artworks
	if (pokemon === 'nidoran-m') {
		url = url.replace('-m', '');
	}
	else if (pokemon === 'nidoran-f') {
		url = url.replace('-f', '');
	}
	else if (pokemon === 'farfetchd') {
		url = url.replace('Farfetchd', 'Farfetch\'d');
	}
	else if (pokemon === 'mr-mime') {
		url = url.replace('Mr-mime', 'Mr._Mime');
	}

	getImageUrl(pokemon, url);

}

function getImageUrl(pokemon, url) {
	request(
		{uri: baseUrl + url},
		function(error, response, body) {
			body = body.slice(body.search('Other resolutions: '));
			nextUrl = body.slice(body.search('https://archives'), body.search('png'));
			nextUrl += 'png';
			if (nextUrl === 'png') {
				console.log(pokemonData.pokemon[pokemon].number.national + pokemon + ' url error');
			}
		}
	);
}
