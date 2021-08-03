
// pokemondb.net data webcrawler
// downloads data from pokemondb.net into a json file

let request = require('request');
let fs = require('fs');

let pokemonData = {};
let url = 'https://pokemondb.net/pokedex/';
getGames(url);
// TODO regional pokedex
// TODO get location data
// TODO get move data
// TODO get ability data
// TODO get item data and locations

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
			pokemonData.pokemon[pokemon]['number'] = {};
			pokemonData.pokemon[pokemon].number.national = body.slice(0, index);

			// TODO regional pokemon alternatives
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
			// TODO get ability data
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
			keyword = 'text-muted\">';
			while (localBody.search(/\d/) != -1) {
				number = localBody.slice(localBody.search(/\d/), localBody.search(' <small'));
				localBody = localBody.slice(localBody.search(keyword) + keyword.length);
				pokedex = localBody.slice(0, localBody.search('</small'));
				pokedex = pokedex.replaceAll('/', '-');
				pokedex = pokedex.replace('(', '');
				pokedex = pokedex.replace(')', '');
				pokedex = pokedex.toLowerCase();
				pokemonData.pokemon[pokemon].number[pokedex] = number;
				localBody = localBody.slice(localBody.search('</small'));
				// TODO may want to format pokedex name
			}

			// TODO get training data
			// TODO get breeding data

			// get stats
			body = body.slice(body.search('<th>HP</th>'));
			pokemonData.pokemon[pokemon]['stats'] = {};
			keyword = 'cell-num\">';

			pokemonData.pokemon[pokemon].stats['hp'] = {};
			body = body.slice(body.search(keyword) + keyword.length);
			pokemonData.pokemon[pokemon].stats.hp.base = body.slice(0, body.search('</td>'));
			body = body.slice(body.search(keyword) + keyword.length);
			pokemonData.pokemon[pokemon].stats.hp.min = body.slice(0, body.search('</td>'));
			body = body.slice(body.search(keyword) + keyword.length);
			pokemonData.pokemon[pokemon].stats.hp.max = body.slice(0, body.search('</td>'));

			pokemonData.pokemon[pokemon].stats['attack'] = {};
			body = body.slice(body.search(keyword) + keyword.length);
			pokemonData.pokemon[pokemon].stats.attack.base = body.slice(0, body.search('</td>'));
			body = body.slice(body.search(keyword) + keyword.length);
			pokemonData.pokemon[pokemon].stats.attack.min = body.slice(0, body.search('</td>'));
			body = body.slice(body.search(keyword) + keyword.length);
			pokemonData.pokemon[pokemon].stats.attack.max = body.slice(0, body.search('</td>'));

			pokemonData.pokemon[pokemon].stats['defense'] = {};
			body = body.slice(body.search(keyword) + keyword.length);
			pokemonData.pokemon[pokemon].stats.defense.base = body.slice(0, body.search('</td>'));
			body = body.slice(body.search(keyword) + keyword.length);
			pokemonData.pokemon[pokemon].stats.defense.min = body.slice(0, body.search('</td>'));
			body = body.slice(body.search(keyword) + keyword.length);
			pokemonData.pokemon[pokemon].stats.defense.max = body.slice(0, body.search('</td>'));

			pokemonData.pokemon[pokemon].stats['spAtk'] = {};
			body = body.slice(body.search(keyword) + keyword.length);
			pokemonData.pokemon[pokemon].stats.spAtk.base = body.slice(0, body.search('</td>'));
			body = body.slice(body.search(keyword) + keyword.length);
			pokemonData.pokemon[pokemon].stats.spAtk.min = body.slice(0, body.search('</td>'));
			body = body.slice(body.search(keyword) + keyword.length);
			pokemonData.pokemon[pokemon].stats.spAtk.max = body.slice(0, body.search('</td>'));

			pokemonData.pokemon[pokemon].stats['spDef'] = {};
			body = body.slice(body.search(keyword) + keyword.length);
			pokemonData.pokemon[pokemon].stats.spDef.base = body.slice(0, body.search('</td>'));
			body = body.slice(body.search(keyword) + keyword.length);
			pokemonData.pokemon[pokemon].stats.spDef.min = body.slice(0, body.search('</td>'));
			body = body.slice(body.search(keyword) + keyword.length);
			pokemonData.pokemon[pokemon].stats.spDef.max = body.slice(0, body.search('</td>'));

			pokemonData.pokemon[pokemon].stats['speed'] = {};
			body = body.slice(body.search(keyword) + keyword.length);
			pokemonData.pokemon[pokemon].stats.speed.base = body.slice(0, body.search('</td>'));
			body = body.slice(body.search(keyword) + keyword.length);
			pokemonData.pokemon[pokemon].stats.speed.min = body.slice(0, body.search('</td>'));
			body = body.slice(body.search(keyword) + keyword.length);
			pokemonData.pokemon[pokemon].stats.speed.max = body.slice(0, body.search('</td>'));

			keyword = '<b>';
			pokemonData.pokemon[pokemon].stats.total = body.slice(body.search(keyword) + keyword.length, body.search('</b>'));
			
			// get evolutions 
			// TODO branched evolutions
			// TODO may need to manually edit evolution text
			// TODO regional evolutions
			body = body.slice(body.search('Evolution chart'));
			localBody = body.slice(0, body.search('</div>\n</div>'));
			pokemonData.pokemon[pokemon].evolutions = [];
			keyword = 'name\" href=\"/pokedex/';
			let extraKeyword = '\\(';
			let evolutionText;
			while (localBody.search(keyword) != -1) {
				localBody = localBody.slice(localBody.search(keyword) + keyword.length);
				pokemonData.pokemon[pokemon].evolutions.push(localBody.slice(0, localBody.search('\"')));
				if (localBody.search(extraKeyword) != -1) {
					evolutionText = localBody.slice(localBody.search(extraKeyword) + extraKeyword.length-1, localBody.search('\\)</small>'));
					/*if (evolutionText.includes('href')) {
						evolutionText = evolutionText.slice(evolutionText.search('>') + 1, evolutionText.search('</a>'));
					}*/
					pokemonData.pokemon[pokemon].evolutions.push(evolutionText);
				}
			}

			// get pokedex descriptions
			body = body.slice(body.search('dex entries'));
			pokemonData.pokemon[pokemon]['descriptions'] = {};
			localBody = body.slice(0, body.search('</table>'));
			let game;
			while(localBody.search('<tr>') != -1) {
				tempBody = localBody.slice(localBody.search('<tr>'), localBody.search('</tr>'));
				game = '';
				keyword = 'igame ';
				while (tempBody.search(keyword) != -1) {
					if (game != '') {
						game += '-';
					}
					tempBody = tempBody.slice(tempBody.search(keyword) + keyword.length);
					game += tempBody.slice(0, tempBody.search('\"'));
				}
				keyword = 'cell-med-text\">';
				tempBody = tempBody.slice(tempBody.search(keyword) + keyword.length);
				pokemonData.pokemon[pokemon].descriptions[game] = tempBody.slice(0, tempBody.search('</td>'));
				localBody = localBody.slice(localBody.search('</tr>') + '</tr>'.length);
			}

			// TODO get moves

			// TODO get locations use bulbapedia

			console.log(pokemon);
			//console.log(pokemonData.pokemon[pokemon]);
			//if (pokemon = 'calyrex') {
				let string = JSON.stringify(pokemonData, null, 4);
				fs.writeFile('pokemonData.json', string, function(err) {
					if (err) return console.log(err);
				});
			//}
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
					pokemonData.pokemon[pokemon].name = pokemon;
				}
			}

			let count = 0;
			if (!game) {
				// get individual pokemon data
				for (pokemon in pokemonData.pokemon) {
					//count++;
					//if (count < 152) {
					getPokemonData(pokemon);
					//}
				}
				//getPokemonData('bulbasaur');
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

			for (game in pokemonData.games) {
				getPokemon(game);
			}

			// get national dex
			getPokemon();
		}
	);
}
