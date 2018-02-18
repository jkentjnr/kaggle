import fs from 'fs';
import moment from 'moment';

(async () => {
	
	const path = '../results';
	const season = 'regular'; // '2015-2016-regular';

	let dir = fs.readdirSync( path );
	let gamesFiles = dir.filter(elm => elm.match('game_boxscore'));

	const gamesOutput = { games: [] };

	//[].concat(gamesFiles[0]).forEach(gameFile => {
	gamesFiles.forEach(gameFile => {
		const data = JSON.parse(fs.readFileSync(`${path}/${gameFile}`, 'utf8')).gameboxscore;
		//console.log(JSON.stringify(game));

		const gameTime = moment.utc(`${data.game.date} ${data.game.time}`, 'YYYY-MM-DD H:mmA').toDate();

		const result = {
			id: parseInt(gameFile.substring(gameFile.indexOf(season) + season.length + 1, gameFile.indexOf('.'))),
			//season: parseInt(season.substring(0, season.indexOf('-'))),
			time: gameTime,
			location: data.game.location,
			teamHomeId: parseInt(data.game.homeTeam.ID),
			teamHomeCode: data.game.homeTeam.Abbreviation,
			teamAwayId: parseInt(data.game.awayTeam.ID),
			teamAwayCode: data.game.awayTeam.Abbreviation,
			scoreHome: parseInt(data.quarterSummary.quarterTotals.homeScore),
			scoreAway: parseInt(data.quarterSummary.quarterTotals.awayScore),
			scoreQuarters: data.quarterSummary.quarter.map(quarter => ({
				number: parseInt(quarter['@number']),
				scoreHome: parseInt(quarter['homeScore']),
				scoreAway: parseInt(quarter['awayScore']),
			}))
		};

		//console.log(result);
		gamesOutput.games.push(result);

		console.log(`${result.id}: ${result.teamAwayCode} @ ${result.teamHomeCode}`);
	});

	fs.writeFileSync('../input/games.json', JSON.stringify(gamesOutput, null, 4));

})();