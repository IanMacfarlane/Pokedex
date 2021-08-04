let request = require('request');
let fs = require('fs');

let pokemonData = require('./pokemonData.json');

let baseUrl = 'https://archives.bulbagarden.net/wiki/File:';
let url;

for (pokemon in pokemonData.pokemon) {
	url = pokemonData.pokemon[pokemon].number.national + pokemon.charAt(0).toUpperCase() + pokemon.slice(1) + '.png';

	// fix special cases TODO regional and multiple form artworks
	if (pokemon === 'nidoran-m') {
		url = url.replace('-m', '');
	}
	else if (pokemon === 'nidoran-f') {
		url = url.replace('-f', '');
	}
	else if (pokemon.includes('fetchd')) {
		url = url.replace('fetchd', 'fetch\'d');
	}
	else if (pokemon === 'type-null') {
		url = url.replace('-n', '_N');
	}
	else if (pokemon.search('-o') != -1 && pokemon != 'ho-oh') {
	}
	else if (pokemon.search('-') != -1) {
		let index = url.search('-') + 1;
		url = url.slice(0, index) + url.charAt(index).toUpperCase() + url.slice(index+1);

		if (pokemon.search('mr') != -1) {
			url = url.replace('-', '._');
		}
		else if (pokemon.search('mime') != -1 || pokemon.search('tapu-') != -1) {
			url = url.replace('-', '_');
		}
	}
	else if (pokemon === 'giratina') {
		url = url.replace('.png', '');
		url += '-Altered.png';
	}
	else if (pokemon === 'shaymin') {
		url = url.replace('.png', '');
		url += '-Land.png';
	}
	else if (pokemon === 'deerling' || pokemon === 'sawsbuck') {
		url = url.replace('.png', '');
		url += '-Spring.png';
	}
	else if (pokemon === 'flabebe') {
		url = url.replace('Flabebe', 'Flabébé');
	}
	else if (pokemon === 'oricorio') {
		url = url.replace('.png', '');
		url += '-Baile.png';
	}
	else if (pokemon === 'wishiwashi') {
		url = url.replace('.png', '');
		url += '-Solo.png';
	}
	else if (pokemon === 'urshifu') {
		url = url.replace('.png', '');
		url += '-Single_Strike.png';
	}

	//if (pokemon === 'bulbasaur' || pokemon === 'ivysaur') {
	getImageUrl(pokemon, url);
	//}
}

function getImageUrl(pokemon, url) {
	request(
		{uri: baseUrl + url},
		function(error, response, body) {
			let nextUrl = '';
			if (body.search('Other resolutions: ') != -1) {
				body = body.slice(body.search('Other resolutions: '));
				nextUrl = body.slice(body.search('https://archives'), body.search('png"'));
			}
			else if (body.search('No file by this name exists.') === -1){
				// no 240x240 image
				body = body.slice(body.search('https://archives'));
				nextUrl = body.slice(0, body.search('png"'));
			}
			nextUrl += 'png';
			if (nextUrl === 'png') {
				console.log(pokemonData.pokemon[pokemon].number.national + pokemon + ' url error');
			}
			else {
				downloadImage(pokemon, nextUrl);
			}
		}
	);
}

function downloadImage(pokemon, url) {
	request.head(url, (err, res, body) => {
		console.log(pokemon + ': ' + url);
		request(url).pipe(fs.createWriteStream('./pokemonArtworks/' + pokemon + '.png')).on('close', () => {
			console.log(pokemon + ': download complete');
		});
	});
}
