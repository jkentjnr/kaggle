import MySportsFeeds from "mysportsfeeds-node";
import fs from 'fs';

const gameType = '2017-2018-regular';

const username = 'jkentjnr';
const password = 'JHu3kdfgJtr9';

const startId = 42072;
const endId = 42935;

(async () => {
	var msf = new MySportsFeeds("1.2", true);
	msf.authenticate(username, password);

	const getGameData = id => new Promise((resolve, reject) => {
		msf.getData('nba', gameType, 'game_boxscore', 'json', { gameid: id, force: true })
			.then(data => setTimeout(() => resolve(data), 1200))
			.catch(e => reject(e));
	});

	const teams = {};
	for (let i = startId; i <= endId; i++) {
		try {
			console.log(i);
			const data = await getGameData(i);
			console.log(data);
		}
		catch (e) {
			console.log('ERRRRRR', e);
			return;
		}

	};

	console.log(teams);

})();