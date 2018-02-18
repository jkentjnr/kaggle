import MySportsFeeds from "mysportsfeeds-node";
import fs from 'fs';

(async () => {
	var msf = new MySportsFeeds("1.2", true);
	msf.authenticate("jkentjnr", "JHu3kdfgJtr9");

	const getGameData = id => new Promise((resolve, reject) => {
		msf.getData('nba', '2015-2016-regular', 'game_boxscore', 'json', { gameid: id, force: true })
			.then(data => setTimeout(() => resolve(data), 1200))
			.catch(e => reject(e));
	});

	const gameScheduleData = await msf.getData('nba', '2015-2016-regular', 'full_game_schedule', 'json', { force: false });

	const teams = {};
	for (let i = 0; i < gameScheduleData.fullgameschedule.gameentry.length; i++) {
		const game = gameScheduleData.fullgameschedule.gameentry[i];

		const homeTeamCode = game.homeTeam.Abbreviation;
		if (!teams[homeTeamCode]) teams[homeTeamCode] = game.homeTeam;

		const awayTeamCode = game.awayTeam.Abbreviation;
		if (!teams[awayTeamCode]) teams[awayTeamCode] = game.awayTeam;

		try {
			const data = await getGameData(game.id);
			console.log(data);
		}
		catch (e) {
			console.log('ERRRRRR', e);
			return;
		}

	};

	console.log(teams);

})();