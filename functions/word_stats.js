const { Client } = require('pg');

const client = new Client ({
	connectionString: process.env.DATABASE_URL,
	ssl: true,
});


client.connect();

function makeQuery(word_)
{
console.log(word_);
let query = 'INSERT INTO words (word)' + '\n'
	  + 'VALUES (\'' + word_ +'\')'+ '\n'
	  + 'ON CONFLICT (word)'   + '\n'
	  + 'DO UPDATE set counter = EXCLUDED.counter + words.counter';
client.query(query, (err,res) => {
	if(err) throw err;
	console.log('Query succesfull, word ' + word_ + 'added.');
});
}

function getData(callback) {
	let query = 'SELECT * from words'   + '\n'
		  + 'ORDER BY COUNTER DESC' + '\n'
		  + 'LIMIT 10';
client.query(query, (err,res) => {
	if(err) throw err;
	let text = 'Топ-10 используемых слов: \n';
	res.rows.forEach( (el) => {
	text += el.word + ' - ' + el.counter + '\n';
});
	return callback(text);
});
}


module.exports = {
	makeQuery: makeQuery,
	getData: getData
};
