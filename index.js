const TelegramBot = require('node-telegram-bot-api');
const pg = require('pg');
const ogs = require('open-graph-scraper');
const axios = require('axios');
const fs = require('fs');
const utf8 = require('utf8');
const encodeUrl = require('encodeurl');
const echo = require('./functions/echo').echo;
const get_weather = require('./functions/get_weather').get_weather;
const define = require('./functions/define2.js');
const remind = require('./functions/remind').remind;
const roll = require('./functions/roll').roll;
const psql = require('./functions/word_stats');

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});


bot.on('message', (msg) => {
	psql.add_word(msg);
});

bot.onText(/\/echo (.+)/, (msg, match) =>
{
 	echo(bot,msg,match[1]);
});

bot.onText(/\/topall/, (msg) => {
	console.log('yes');
	psql.getData(msg, (res) => bot.sendMessage(msg.chat.id, res))
});


bot.onText(/\/topme/, (msg) => {
	psql.topPerson(msg, (res) => bot.sendMessage(msg.chat.id,res));
});

bot.onText(/\/weather/, (msg) =>
{
	get_weather(bot,msg);
});

bot.onText(/\/def (.+)/, (msg, match) => {

//define.translate(match[1],'ru|eng', define.editWiki, bot, msg);
define.editWiki(match[1],bot,msg);
});

bot.onText(/\/remind (.+)/, (msg, match) => {
	remind(match[1],bot,msg);
});


bot.onText(/\/roll (.+)/, (msg,match) => {
	roll(match[1],bot,msg);
});



bot.on('callback_query', (query) => {
	const action = query.data;
	const msg = query.message;
	bot.deleteMessage(msg.chat.id, msg.message_id);
	define.sendText(action,bot,msg);

});




bot.on("polling_error", (err) => console.log(err));
