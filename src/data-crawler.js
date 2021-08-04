
// pokemondb.net data webcrawler
// downloads data from pokemondb.net into a json file

let request = require('request');
let fs = require('fs');

let pokemonData = {};
let url = 'https://pokemondb.net/pokedex/';
getGames(url);

// TODO regional, and multiple form pokemon, mega evolutions, gigantamax
// TODO get location data
// TODO get move data
// TODO get ability data
// TODO get item data

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
				if (pokedex === 'yellow-red-blue') {
					pokedex = 'red-blue-yellow';
				}
				else if (pokedex.includes('x-y &mdash; ')) {
					pokedex = pokedex.replace('x-y &mdash; ', '');
					pokedex = pokedex.replace(' ', '-');
				}
				else if (pokedex === 'let\'s go pikachu-let\'s go eevee') {
					pokedex = 'lets-go-pikachu-eevee';
				}
				else if (pokedex.includes('sun-moon &mdash;')) {
					pokedex = 'sun-moon';
				}
				else if (pokedex.includes('u.sun-u.moon &mdash;')) {
					pokedex = 'ultra-sun-ultra-moon';
				}
				else if (pokedex === 'the isle of armor') {
					pokedex = 'isle-of-armor';
				}
				else if (pokedex === 'the crown tundra') {
					pokedex = 'crown-tundra';
				}
				else if (pokedex === 'omega ruby-alpha sapphire') {
					pokedex = 'omega-ruby-alpha-sapphire';
				}
				pokemonData.pokemon[pokemon].number[pokedex] = number;
				localBody = localBody.slice(localBody.search('</small'));
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

			// for sun-moon usun-umoon ignore islands
			if (game === 'ultra-sun-ultra-moon' || game === 'sun-moon') {
				body = body.slice(0, body.search('id=\"dex-melemele-island\"'));
			}

			// for x-y split up regions
			if (game == 'x-y') {

				let localBody = body.slice(0, body.search('id=\"dex-coastal-kalos\"'));
				keyword = 'name" href=\"/pokedex/';
				pokemonData.games[game]['central'] = {};
				pokemonData.games[game]['central'].pokemon = [];
				while (localBody.search(keyword) != -1) {
					index = localBody.search(keyword);
					localBody = localBody.slice(index + keyword.length);
					index = localBody.search('\"');
					pokemonData.games[game]['central'].pokemon.push(localBody.slice(0, index));
				}
				localBody = body.slice(body.search('id=\"dex-coastal-kalos\"'), body.search('id=\"dex-mountain-kalos\"'));
				pokemonData.games[game]['coastal'] = {};
				pokemonData.games[game]['coastal'].pokemon = [];
				while (localBody.search(keyword) != -1) {
					index = localBody.search(keyword);
					localBody = localBody.slice(index + keyword.length);
					index = localBody.search('\"');
					pokemonData.games[game]['coastal'].pokemon.push(localBody.slice(0, index));
				}
				localBody = body.slice(body.search('id=\"dex-mountain-kalos\"'));
				pokemonData.games[game]['mountain'] = {};
				pokemonData.games[game]['mountain'].pokemon = [];
				while (localBody.search(keyword) != -1) {
					index = localBody.search(keyword);
					localBody = localBody.slice(index + keyword.length);
					index = localBody.search('\"');
					pokemonData.games[game]['mountain'].pokemon.push(localBody.slice(0, index));
				}

			}
			else {


				if (game) {
					// sword-shield, isle of armor, crown tundra
					if (game === 'sword-shield') {
						pokemonData.games[game]['galar'] = {};
						pokemonData.games[game]['galar'].pokemon = [];
					}
					else if (game.includes('isle-of-armor')) {
						pokemonData.games['sword-shield']['isle-of-armor'] = {};
						pokemonData.games['sword-shield']['isle-of-armor'].pokemon = [];
					}
					else if (game.includes('crown-tundra')) {
						pokemonData.games['sword-shield']['crown-tundra'] = {};
						pokemonData.games['sword-shield']['crown-tundra'].pokemon = [];
					}
					else {
						pokemonData.games[game].pokemon = [];
					}
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
						// sword-shield, isle of armor, crown tundra
						if (game === 'sword-shield') {
							pokemonData.games[game]['galar'].pokemon.push(pokemon);
						}
						else if (game.includes('isle-of-armor')) {
							pokemonData.games['sword-shield']['isle-of-armor'].pokemon.push(pokemon);
						}
						else if (game.includes('crown-tundra')) {
							pokemonData.games['sword-shield']['crown-tundra'].pokemon.push(pokemon);
						}
						else {
							pokemonData.games[game].pokemon.push(pokemon);
						}
					}
					else {
						pokemonData.pokemon[pokemon] = {};
						// TODO pretty print names
						pokemonData.pokemon[pokemon].name = pokemon;
					}
				}
			}

			if (!game) {
				// get individual pokemon data
				for (pokemon in pokemonData.pokemon) {
					getPokemonData(pokemon);
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
				// TODO name for pretty printing
			}

			for (game in pokemonData.games) {
				getPokemon(game);
			}
			// get pokemon for isle of armor and crown tundra
			getPokemon('sword-shield/isle-of-armor');
			getPokemon('sword-shield/crown-tundra');

			// get national dex
			getPokemon();
		}
	);
}
