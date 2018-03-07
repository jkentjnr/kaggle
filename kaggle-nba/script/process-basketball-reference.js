import fs from 'fs';
import path from 'path';
import moment from 'moment';

const parseName = (name) => {
	switch(name) {
		case 'Los Angeles Lakers': return 'LAL';
		case 'Philadelphia 76ers': return 'PHI';
		case 'San Antonio Spurs': return 'SAS';
		case 'Boston Celtics': return 'BOS';
		case 'Chicago Bulls': return 'CHI';
		case 'Denver Nuggets': return 'DEN';
		case 'Detroit Pistons': return 'DET';
		case 'Golden State Warriors': return 'GSW';
		case 'Minnesota Timberwolves': return 'MIN';
		case 'New Orleans Hornets': return 'NOP';
		case 'New Orleans/Oklahoma City Hornets': return 'NOP';
		case 'New Orleans Pelicans': return 'NOP';
		case 'New York Knicks': return 'NYK';
		case 'Sacramento Kings': return 'SAC';
		case 'Toronto Raptors': return 'TOR';
		case 'Utah Jazz': return 'UTA';
		case 'Houston Rockets': return 'HOU';
		case 'Orlando Magic': return 'ORL';
		case 'Phoenix Suns': return 'PHX';
		case 'Seattle SuperSonics': return 'SEA';
		case 'Indiana Pacers': return 'IND';
		case 'Los Angeles Clippers': return 'LAC';
		case 'Memphis Grizzlies': return 'MEM';
		case 'Miami Heat': return 'MIA';
		case 'New Jersey Nets': return 'BRO';
		case 'Brooklyn Nets': return 'BRO';
		case 'Atlanta Hawks': return 'ATL';
		case 'Dallas Mavericks': return 'DAL';
		case 'Milwaukee Bucks': return 'MIL';
		case 'Portland Trail Blazers': return 'POR';
		case 'Washington Wizards': return 'WAS';
		case 'Cleveland Cavaliers': return 'CLE';
		case 'Charlotte Bobcats': return 'CHA';
		case 'Charlotte Hornets': return 'CHA';
		case 'Oklahoma City Thunder': return 'OKL';
		default: throw new Error(name);
	}
}

const parseStats = (totals, oppTotals) => {
	return {
		"Fg2PtAtt": totals['2PA'],
		"Fg2PtMade": totals['2P'],
		"Fg2PtPct": totals['2P%'],
		"Fg3PtAtt": totals['3PA'],
		"Fg3PtMade": totals['3P'],
		"Fg3PtPct": totals['3P%'],
		"FgAtt": totals['FGA'],
		"FgMade": totals['FG'],
		"FgPct": totals['FG%'],
		"FtAtt": totals['FTA'],
		"FtMade": totals['FT'],
		"FtPct": totals['FT%'],
		"OffReb": totals['ORB'],
		"DefReb": totals['DRB'],
		"Reb": totals.ORB + totals.DRB,
		"Ast": totals.AST,
		"Pts": totals.PTS,
		"Tov": totals.TOV,
		"Stl": totals.STL,
		"Blk": totals.BLK,
		"BlkAgainst": oppTotals.BLK,
		"PtsAgainst": oppTotals.PTS,
		"Fouls": null,
		"FoulPers": null,
		"FoulTech": null,
		"PlusMinus": totals.PTS - oppTotals.PTS,
		"Wins": null,
		"Losses": null,
		"WinPct": null
	};
}

(async () => {
	
	const target = '../input/games.json';
	const filesFolder = '../results/basketball-reference';

	const gamesOutput = JSON.parse(fs.readFileSync(target, 'utf8'));	
	const dirs = (p => fs.readdirSync(p).filter(f => fs.statSync(path.join(p, f)).isDirectory()))(filesFolder);

	dirs.forEach(seasonFolderName => {
		const seasonFolder = path.join(filesFolder, seasonFolderName);
		console.log(seasonFolder);

		const files = fs.readdirSync( seasonFolder );
		//console.log(files);

		files.forEach(gameFileName => {
			const data = JSON.parse(fs.readFileSync(path.join(seasonFolder, gameFileName), 'utf8'));
			//console.log(data);

			const gameTime = moment.utc(`${data.date} ${data.time}`, 'YYYY-MM-DD HH:mm:ss').toDate();

			const result = {
				id: data.code,
				time: gameTime,
				season: parseInt(data.season.substring(0, data.season.indexOf('-'))),
				teamHomeId: null,
				teamHomeCode: parseName(data.home.name),
				teamAwayId: null,
				teamAwayCode: parseName(data.away.name),
				scoreHome: parseInt(data.home.scores.T),
				scoreAway: parseInt(data.away.scores.T),
				scoreQuarters: Object.keys(data.home.scores).filter(q => q !== 'T').map(quarter => ({
					number: parseInt(quarter),
					scoreHome: parseInt(data.home.scores[quarter]),
					scoreAway: parseInt(data.away.scores[quarter]),
				})),
				statsHome: parseStats(data.home.totals, data.away.totals),
				statsAway: parseStats(data.away.totals, data.home.totals),
			};

			const start = moment(gameTime).subtract(8, 'hours').toDate(); // new Date(game[0], getMonth(game[2]), game[1]).addDays(-2);
			const end = moment(gameTime).add(8, 'hours').toDate(); // new Date(game[0], getMonth(game[2]), game[1]).addDays(2);

			const match = gamesOutput.games.filter(item => 
				new Date(item.time).getTime() > start.getTime() &&
				new Date(item.time).getTime() < end.getTime() &&
				item.teamHomeCode === result.teamHomeCode &&
				item.teamAwayCode === result.teamAwayCode
			);

			if (match.length === 0) {
				gamesOutput.games.push(result);
				console.log(`${result.id}: ${result.teamAwayCode} @ ${result.teamHomeCode}`);
			}

		})
	});

	fs.writeFileSync(target, JSON.stringify(gamesOutput, null, 4));

})();