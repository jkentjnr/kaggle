import fs from 'fs';
import parse from 'csv-parse';

const records = fs.readFileSync(`../results/odds/odds.csv`, 'utf8');
const games = JSON.parse(fs.readFileSync(`../input/games.json`, 'utf8')).games;

Date.prototype.addDays = function(days) {
  var dat = new Date(this.valueOf());
  dat.setDate(dat.getDate() + days);
  return dat;
}

const parseName = (name) => {
	switch(name) {
		case 'BKN': return 'BRO';
		case 'OKC': return 'OKL';
		default: return name;
	}
}

const getMonth = (mth) => {
	switch(mth) {
		case 'Jan': return 0;
		case 'Feb': return 1;
		case 'Mar': return 2;
		case 'Apr': return 3;
		case 'May': return 4;
		case 'Jun': return 5;
		case 'Jul': return 6;
		case 'Aug': return 7;
		case 'Sep': return 8;
		case 'Oct': return 9;
		case 'Nov': return 10;
		case 'Dec': return 11;
	}
}

parse(records, {}, (err, data) => {
	//[].concat(data.filter(item => item[6] === '2016/2017')).forEach(game => {
	data.filter(item => item[6] === '2016/2017').forEach(game => {
		const start = new Date(game[0], getMonth(game[2]), game[1]).addDays(-2);
		const end = new Date(game[0], getMonth(game[2]), game[1]).addDays(2);

		const match = games.filter(item => 
			new Date(item.time).getTime() > start.getTime() &&
			new Date(item.time).getTime() < end.getTime() &&
			item.teamHomeCode === parseName(game[9]) &&
			item.teamAwayCode === parseName(game[10])
		);

		if (match.length > 0) {
			const entry = match[0];
			entry.oddsBet365Home = parseFloat(game[17]);
			entry.oddsBet365Away = parseFloat(game[18]);
		}
	})

	fs.writeFileSync('../input/games.json', JSON.stringify({ games }, null, 4));
});
