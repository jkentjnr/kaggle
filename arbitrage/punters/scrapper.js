import fs from 'fs';
import path from 'path';
import prettyjson from 'prettyjson';
import punters from './lib/punters';
import moment from 'moment';
import logger from './lib/logger';
import stringify from 'csv-stringify/lib/sync';
import { ArgumentParser } from 'argparse';

(async () => {

	const parser = new ArgumentParser({
		version: '0.0.1',
		addHelp: true,
		description: 'Punters.com.au Arbitrage Calculator'
	});

	parser.addArgument(
		'--config',
		{
			help: 'Loads the configuration file.',
			defaultValue: 'config.json'
		}
	);

	parser.addArgument(
		'--output',
		{
			help: 'Specifies the output folder.',
			defaultValue: 'output'
		}
	);
	const args = parser.parseArgs();

	// --------------------------------------------------------

	const outputFolder = './' + args.output;

	// Get config - blacklist, etc
	const config = JSON.parse(fs.readFileSync(`${__dirname}/${args.config}`, 'utf8'));

	const filename = path.join(outputFolder, `${config.key}_data.json`);
	const dataOutput = path.join(outputFolder, `${config.key}_evaluation.csv`);
	const betDataOutput = path.join(outputFolder, `${config.key}_evaluation_data.csv`);

	// Identify the sports to download
	const params = { jobs: config.sports.map(item => Object.assign({}, item, { "sport": punters.getSportsType(item.sport) })) };

	// Get target to win amount
	const target = config.target || 100;

	// --------------------------------------------------------

	if (!fs.existsSync(outputFolder)){
		fs.mkdirSync(outputFolder);
	}

	let data = null;
	if (fs.existsSync(filename)) {
		data = JSON.parse(fs.readFileSync(filename, 'utf8'));
	}
	else {
		data = await punters.getOdds(params);

		fs.writeFileSync(filename, JSON.stringify(data, null, 4));
		console.log('File written to disk.'); 
	}

	// --------------------------------------------------------

	const successList = [];
	const evaluationList = [];
	let allBetList = [];

	Object.keys(data.sports).forEach(sportKey => {
		data.sports[sportKey].forEach(event => {
			//console.log(event);
			logger.log();
			logger.log('ID:      ', event.id);
			logger.log('Name:    ', event.name);
			logger.log('Type:    ', event.type);
			logger.log('Time:    ', moment(event.time).format('dddd, MMMM Do YYYY, h:mm:ss a'));
			logger.log(`         ${moment(event.time).fromNow()}`);
			logger.log('-------------------------------------------------------------');
			logger.log();

			let processEvent = true;
			if (config.blacklist.event.id.includes(parseInt(event.id)) === true) {
				processEvent = false;
				logger.nomatch('Blacklisted Event');
			}

			if (processEvent && config.limits.dimensions && event.options.length >= config.limits.dimensions) {
				processEvent = false;
				logger.nomatch(`Too Many Dimensions (${event.options.length})`);
			}

			if (processEvent && config.limits.days && moment().add(config.limits.days, 'days').isAfter(event.time) === false) {
				processEvent = false;
				logger.nomatch(`Too Far into the Future`);
			}

			if (processEvent && !config.limits.inplay && moment().isAfter(event.time) === true) {
				processEvent = false;
				logger.nomatch(`Currently In-Play`);
			}

			if (processEvent === true) {

				const betList = [];
				event.options.forEach(entry => {
					let odds = 0;
					let agency = null;
					entry.odds.forEach(item => {
						if (item.value > odds && config.blacklist.agency.includes(item.agency) === false) {
							odds = item.value;
							agency = item.agency;
						}
					});

					betList.push({
						id: event.id,
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

				allBetList = allBetList.concat(betList);

				const retVal = target - outlay;
				const percentage = (target / outlay) * 100;

				const evaluation = {
					id: event.id,
					name: event.name,
					type: event.type,
					time: event.time,
					safetime: moment(event.time).format('YYYYMMDDHHmmss'),
					inplay: event.time < new Date(),
					outlay: outlay,
					percentage: percentage,
					returnAmount: retVal,
					profitable: (outlay < target),
					dimensions: event.options.length
				};

				if (evaluation.profitable && evaluation.percentage >= config.limits.ROI) {

					logger.match(`$${outlay.toFixed(2)} | ${percentage.toFixed(2)}% | Return: $${retVal.toFixed(2)}`);
					successList.push(evaluation);
				}
				else {
					logger.nomatch(`$${outlay.toFixed(2)} | ${percentage.toFixed(2)}% | Return: $${retVal.toFixed(2)}`);
				}

				evaluationList.push(evaluation);
			}

			logger.log();
			logger.log('=============================================================');

			//throw new Error('ERR');
		})
	});

	let totalOutlay = 0;
	let totalReturn = 0;

	logger.summary();
	logger.summary(`Parameters`);
	logger.summary(`----------`);
	logger.summary();
	const configResult = prettyjson.render(config).split('\n');
	configResult.forEach(line => logger.summary(line));
	logger.summary();
	logger.summary('-------------------------------------------------------------');

	successList.sort((a, b) => b.returnAmount - a.returnAmount).forEach(entry => {
		logger.summary();
		logger.summary('Name:    ', entry.name, `(${entry.id})`);
		logger.summary('Type:    ', entry.type);
		logger.summary(`Time:    ${moment(entry.time).format('dddd, MMMM Do YYYY, h:mm:ss a')}`);
		logger.summary(`         ${moment(entry.time).fromNow()}`);
		logger.summary('Outlay:  ', `$${entry.outlay.toFixed(2)} | ${entry.percentage.toFixed(2)}%`);
		logger.summary('Return:  ', `$${entry.returnAmount.toFixed(2)}`);
		logger.summary();

		allBetList.filter(item => item.id === entry.id).forEach(item => {
			logger.summary(`$${item.outlay.toFixed(2)} | ${item.name}: ${item.odds} @ ${item.agency}`);
		});

		logger.summary();
		logger.summary('-------------------------------------------------------------');

		totalOutlay += entry.outlay;
		totalReturn += entry.returnAmount;
	});

	logger.summary();
	logger.summary('Total Outlay:  ', `$${totalOutlay.toFixed(2)}`);
	logger.summary('Total Return:  ', `$${totalReturn.toFixed(2)}`);
	logger.summary();

	evaluationList.sort((a, b) => b.returnAmount - a.returnAmount);
	const csvData = stringify(evaluationList, { header: true });
	fs.writeFileSync(dataOutput, csvData);
	logger.summary(`CSV Outputted to: ${dataOutput}`);

	const csvBetData = stringify(allBetList, { header: true });
	fs.writeFileSync(betDataOutput, csvBetData);
	logger.summary(`CSV Outputted to: ${betDataOutput}`);

	logger.summary();

})();