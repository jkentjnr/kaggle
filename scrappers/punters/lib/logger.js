import colors from 'colors/safe';

const log = (a='',b='',c='',d='',e='',f='') => {
	console.log(colors.black.bgCyan(' Evaluate '), ' ', a,b,c,d,e,f);
}

const match = (a='',b='',c='',d='',e='',f='') => {
	console.log(colors.black.bgGreen(' Success  '), ' ', a,b,c,d,e,f);
}

const nomatch = (a='',b='',c='',d='',e='',f='') => {
	console.log(colors.black.bgRed(  ' Failed   '), ' ', a,b,c,d,e,f);
}

module.exports = {
	log,
	match,
	nomatch
};