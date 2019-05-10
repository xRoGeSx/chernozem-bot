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
});
}

module.exports = {
	makeQuery: makeQuery
};
