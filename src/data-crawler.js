
// pokemondb.net data webcrawler
// downloads data from pokemondb.net into a json file

let request = require('request');

let pokemonData = {};
let url = 'https://pokemondb.net/pokedex/';
getGames(url);
// TODO regional pokedex
// TODO get location data
// TODO get move data
// TODO get ability data

// TODO download pokemon images


function getPokemonData(pokemon) {
	request(
		{ uri: url + pokemon },
		function(error, response, body) {

			keyword = 'vitals-table';
			index = body.search(keyword);
			body = body.slice(index);

			// get national pokedex number
			keyword = 'strong>';
			index = body.search(keyword);
			body = body.slice(index + keyword.length);
			index = body.search('<');
			pokemonData.pokemon.bulbasaur['number'] = {};
			pokemonData.pokemon.bulbasaur.number.national = body.slice(0, index);

			// get types
			index = body.search('Type');
			body = body.slice(index);
			let localBody = body.slice(0, body.search('</td>'));
			pokemonData.pokemon[pokemon].type = [];
			keyword = '/type/';
			while (localBody.search(keyword) != -1) {
				index = localBody.search(keyword);
				localBody = localBody.slice(index + keyword.length);
				index = localBody.search('\"');
				pokemonData.pokemon[pokemon].type.push(localBody.slice(0, index));
			}

			// get species
			keyword = '<th>Species</th>\n<td>';
			index = body.search(keyword);
			body = body.slice(index + keyword.length);
			index = body.search('</td>');
			pokemonData.pokemon[pokemon].species = body.slice(0, index);

			// TODO get height
			// TODO get weight

			// get abilites
			body = body.slice(body.search('Abilities'));
			localBody = body.slice(0, body.search('</tr>'));
			pokemonData.pokemon[pokemon].abilities = [];
			pokemonData.pokemon[pokemon].abilitiesHidden = [];
			let ability;
			let tempBody;
			keyword = '/ability/';
			while (localBody.search(keyword) != -1) {
				index = localBody.search(keyword);
				localBody = localBody.slice(index + keyword.length);
				index = localBody.search('\"');
				ability = localBody.slice(0, index);
				// check for hidden ability
				tempBody = localBody.slice(0, localBody.search('<br>'));
				if (tempBody.search('hidden ability') != -1) {
					pokemonData.pokemon[pokemon].abilitiesHidden.push(ability);
				}
				else {
					pokemonData.pokemon[pokemon].abilities.push(ability);
				}
			}

			// get local pokedex numbers
			body = body.slice(body.search('Local')).slice(body.search('\n'));
			localBody = body.slice(0, body.search('</td>'));
			let number;
			let pokedex;
			let regex = /\d/;
			keyword = 'text-muted\">';
			while (localBody.search(regex) != -1) {
				number = localBody.slice(localBody.search(regex), localBody.search(' <small'));
				localBody = localBody.slice(localBody.search(keyword) + keyword.length);
				pokedex = localBody.slice(0, localBody.search('</small'));
				pokemonData.pokemon[pokemon].number[pokedex] = number;
				// TODO may want to format pokedex name
			}

			// TODO get stats

			// TODO get evolutions

			// TODO get pokedex descriptions

			// TODO get moves

			// TODO get locations

			console.log(pokemonData.pokemon.bulbasaur);
		}
	);
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
				pokemonData.pokemon = {};
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
					pokemonData.pokemon[pokemon] = {};
				}
			}

			if (!game) {
				// get individual pokemon data
				/*for (pokemon in pokemonData.pokemon) {
					getPokemonData(pokemon);
				}*/
				getPokemonData('bulbasaur');
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
				pokemonData.games[game] = {};
			}

			console.log(pokemonData);

			for (game in pokemonData.games) {
				getPokemon(game);
			}

			// get national dex
			getPokemon();
		}
	);
}
