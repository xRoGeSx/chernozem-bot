const { Client } = require('pg');

const client = new Client ({
	connectionString: process.env.DATABASE_URL,
	ssl: true,
});


client.connect();

function topPerson(msg,callback) {
	let unique_id = msg.from.id + msg.chat.id;
	if(unique_id<1)
	unique_id *=-1;
	let table_id = 'id_' + unique_id;
let query = 'SELECT * from ' + table_id + '\n'
	  + 'ORDER BY COUNTER DESC' + '\n'
	  + 'LIMIT 10' ;
client.query(query, (err,res) => {
	if(err) throw err;
	let text = 'Топ-10 используемых слов пользователя ' + msg.from.first_name + ' ' + msg.from.last_name + '\n' 
		 + 'В конференции ' + msg.chat.title + '\n'	;
	res.rows.forEach( (el) => {
	text += el.word + ' - ' + el.counter + '\n';
});
	return callback(text);
});
}


function makeQuery(word_,msg)
{
let unique_id = msg.from.id + msg.chat.id;
if(unique_id<1)
unique_id *=-1;
let table_id = 'id_' + unique_id;
let query = 'INSERT INTO ' + table_id + ' (word)' + '\n'
	  + 'VALUES (\'' + word_ +'\')' + '\n'
	  + 'ON CONFLICT (word)'   + '\n'
+ 'DO UPDATE set counter = EXCLUDED.counter + ' + table_id + '.counter';
//console.log(query);
client.query(query, (err,res) => {
	if(err) throw err;
	console.log('Query succesfull, word ' + word_ + ' added.');
});
}

function getData(msg,callback) {

	let chat_id = msg.chat.id;
	let query = 'SELECT * from user_list'   + '\n'
		  + 'WHERE fk_group_id=' + chat_id + '\n'
	let u_id = [];
client.query(query, (err,res) => {
	if(err) throw err;
	res.rows.forEach( (row,index) => {
	if(row.pk_unique_id<0)
	row.pk_unique_id *= -1;
	u_id[index] = 'id_'+row.pk_unique_id;
	console.log(u_id[index]);
	});
 
	query = 'SELECT word,sum(counter) FROM ( \n'
	u_id.forEach( (string,index) => {
	if(index != u_id.length-1)
	query+='SELECT word,counter from ' + string + ' UNION ALL \n';
	else
	query+='SELECT word,counter from ' + string + '\n'
	});
	query+=') x GROUP BY word' + '\n'
	     + 'ORDER BY sum DESC LIMIT 10';
	client.query(query, (err,res) => {
	if(err) throw err;
	let text = 'Топ-10 используемых слов' + '\n'
	 + 'В конференции ' + msg.chat.title + '\n'	;
	res.rows.forEach( (el) => {
	text += el.word + ' - ' + el.sum + '\n';
		});
	return callback(text);
	});
});


}

function add_word (msg) {
//	console.log('msg sent from chat: ' + msg.chat.id);
//	console.log('msg sent from user: ' + msg.from.id);
	if(!msg.text)
	return;
	if(msg.from.is_bot)
	return;
	handle_table(msg);
	let text = msg.text;
	text = text.split(' ');
	text.forEach( (word, index) => {
	text[index] = word.toLowerCase();
	text[index] = text[index].split(',')[0];
	text[index] = text[index].split('.')[0];
	text[index] = text[index].split(';')[0];
	text[index] = text[index].split('/')[0];
	text[index] = text[index].split(')')[0];
	text[index] = text[index].split('(')[0];
	})
	text = text.filter( word => word.length >= 3 );
	const delay = 2000;
	let make_query = setInterval( ()=>{makeQuery(text.shift(),msg)}, delay);
	setTimeout(() => {
	clearInterval(make_query)},
	(delay + 50) * text.length );
};

function handle_table(msg) {
	if(!msg.chat.title)
	return

let usr_id = msg.from.id;
let chat_id = msg.chat.id;
	let query = 'INSERT INTO group_list (pk_group_id, group_name)' + '\n'
		  + 'VALUES (' + chat_id + ', \'' + msg.chat.title + '\')' + '\n'
		  + 'ON CONFLICT DO NOTHING';
//	console.log(query);
	client.query(query, (err,res) => {
	if(err) throw err;
});
	let unique_id = usr_id + chat_id;
	query = 'INSERT INTO user_list (pk_unique_id, pk_user_id, user_name, fk_group_id)' + '\n'
	      + 'VALUES (' + unique_id + ',' + usr_id  + ',\'' + msg.from.first_name + '\',' + chat_id + ')' + '\n'
	      + 'ON CONFLICT DO NOTHING';
	//console.log(query);
	client.query(query, (err,res) => {
	if(err) throw err;
});
	if(unique_id < 0)
	unique_id *= -1;
	let table_id = 'id_' + unique_id;
	query = 'CREATE TABLE IF NOT EXISTS ' + table_id + '( \n'
	      + 'word varchar(20) UNIQUE, ' + '\n'
	      + 'counter integer DEFAULT 1 )'
	client.query(query, (err,res) => {
	if(err) throw err;
});
};


module.exports = {
	makeQuery: makeQuery,
	getData: getData,
	add_word: add_word,
	topPerson: topPerson
};
