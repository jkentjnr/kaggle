import fs from 'fs';
import util from 'util';
import colors from 'colors/safe';

const log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
const log_stdout = process.stdout;

console.log = function(a='',b='',c='',d='',e='',f='') { //
  log_file.write(util.format(a) + util.format(b) + util.format(c) + util.format(d) + util.format(e) + util.format(f) + '\n');
  log_stdout.write(util.format(a) + util.format(b) + util.format(c) + util.format(d) + util.format(e) + util.format(f) + '\n');
};

const log = (a='',b='',c='',d='',e='',f='') => {
	console.log(colors.black.bgCyan(' Evaluate '), ' ', a,b,c,d,e,f);
}

const fetch = (a='',b='',c='',d='',e='',f='') => {
	console.log(colors.white.bgBlue(' Fetching '), ' ', a,b,c,d,e,f);
}

const summary = (a='',b='',c='',d='',e='',f='') => {
	console.log(colors.white.bgMagenta(' Summary  '), ' ', a,b,c,d,e,f);
}

const match = (a='',b='',c='',d='',e='',f='') => {
	console.log(colors.black.bgGreen(' Success  '), ' ', a,b,c,d,e,f);
}

const nomatch = (a='',b='',c='',d='',e='',f='') => {
	console.log(colors.black.bgRed(  ' Failed   '), ' ', a,b,c,d,e,f);
}

module.exports = {
	log,
	fetch,
	match,
	nomatch,
	summary
};