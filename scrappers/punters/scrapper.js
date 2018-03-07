import fs from 'fs';
import punters from './lib/punters';
import logger from './lib/logger';
import stringify from 'csv-stringify/lib/sync';

var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(a='',b='',c='',d='',e='',f='') { //
  log_file.write(util.format(a) + util.format(b) + util.format(c) + util.format(d) + util.format(e) + util.format(f) + '\n');
  log_stdout.write(util.format(a) + util.format(b) + util.format(c) + util.format(d) + util.format(e) + util.format(f) + '\n');
};

(async () => {

	const target = 100;
	const filename = './output/data.json';
	const dataOutput = './output/evaluation.csv';

	const params = { 
		jobs: [
			//{ sport: punters.SPORT_TYPE_SOCCER, limit: 400 },
			{ sport: punters.SPORT_TYPE_AFL },
			/*
			{ sport: punters.SPORT_TYPE_RUGBY_LEAGUE },
			{ sport: punters.SPORT_TYPE_RUGBY_UNION },
			{ sport: punters.SPORT_TYPE_CAR_RACING },
			{ sport: punters.SPORT_TYPE_GOLF },
			{ sport: punters.SPORT_TYPE_TENNIS },
			{ sport: punters.SPORT_TYPE_CRICKET },
			{ sport: punters.SPORT_TYPE_BASKETBALL },
			*/
		]
	};

	let data = null;
	if (fs.existsSync(filename)) {
		data = JSON.parse(fs.readFileSync(filename, 'utf8'));
	}
	else {
		data = await punters.getOdds(params);

		fs.writeFileSync('./output/data.json', JSON.stringify(data, null, 4));
		console.log('File written to disk.'); 
	}

	const successList = [];
	const evaluationList = [];

	Object.keys(data.sports).forEach(sportKey => {
		data.sports[sportKey].forEach(event => {
			//console.log(event);
			logger.log();
			logger.log('ID:      ', event.id);
			logger.log('Name:    ', event.name);
			logger.log('Type:    ', event.type);
			logger.log('Time:    ', event.time);
			logger.log('-------------------------------------------------------------');
			logger.log();

			const betList = [];
			event.options.forEach(entry => {
				let odds = 0;
				let agency = null;
				entry.odds.forEach(item => {
					if (item.value > odds) {
						odds = item.value;
						agency = item.agency;
					}
				});

				betList.push({
					name: entry.name,
					odds,
					agency,
					outlay: target / odds
				});
			});

			let outlay = 0;
			betList.forEach(entry => {
				logger.log(`$${entry.outlay.toFixed(2)} | ${entry.name}: ${entry.odds} @ ${entry.agency}`);
				outlay += entry.outlay;
			});

			const percentage = outlay / target;
			const retVal = target - outlay;

			const evaluation = {
				id: event.id,
				name: event.name,
				type: event.type,
				time: event.time,
				outlay: outlay,
				percentage: percentage,
				returnAmount: retVal,
				profitable: (outlay < target),
				dimensions: event.options.length
			};

			if (evaluation.profitable) {

				logger.match(`$${outlay.toFixed(2)} | ${percentage.toFixed(2)}% | Profit: $${retVal.toFixed(2)}`);
				successList.push(evaluation);
			}
			else {
				logger.nomatch(`$${outlay.toFixed(2)} | ${percentage.toFixed(2)}% | Loss: $${retVal.toFixed(2)}`);
			}

			evaluationList.push(evaluation);

			logger.log();
			logger.log('=============================================================');

			//throw new Error('ERR');
		})
	});

	let totalOutlay = 0;
	let totalReturn = 0;

	successList.sort((a, b) => a.returnAmount - b.returnAmount).forEach(entry => {
		logger.log();
		logger.log('Name:    ', entry.name, `(${entry.id})`);
		logger.log('Type:    ', entry.type);
		logger.log('Outlay:  ', `$${entry.outlay.toFixed(2)} | ${entry.percentage.toFixed(2)}`);
		logger.log('Return:  ', `$${entry.returnAmount.toFixed(2)}`);
		logger.log();

		totalOutlay += entry.outlay;
		totalReturn += entry.returnAmount;
	});

	logger.log();
	logger.log('Total Outlay:  ', `$${totalOutlay.toFixed(2)}`);
	logger.log('Total Return:  ', `$${totalReturn.toFixed(2)}`);
	logger.log();

	evaluationList.sort((a, b) => b.returnAmount - a.returnAmount);
	const csvData = stringify(evaluationList, { header: true });
	fs.writeFileSync(dataOutput, csvData);

	logger.log(`CSV Outputted to: ${dataOutput}`);
	logger.log();

})();