const axios = require('axios');
const encodeUrl = require('encodeurl');

let data;

function translate(sentance, lang, callback, bot, msg)
{
	let query = 'https://api.mymemory.translated.net/get?de=xrogesx@ukr.net&key=408961885048b70ce09f&q='
	query+=sentance;
	query+='&langpair='+lang;
	axios.get(encodeUrl(query))
	 .then(response => {
	 return callback(response.data.responseData.translatedText, bot, msg);
})
	.catch(error => {
});
}

function editWiki(word, bot, msg)
{
 word = word.split(' ').join('_');
 let wikiAPI  = 'https://ru.wikipedia.org/w/api.php?format=json&action=opensearch&search=' + word;
	axios.get(encodeUrl(wikiAPI))
	 .then(result => {
	 data = result.data;
	 createPoll(data[1], bot,msg.chat.id);
});
}

function sendText(id,bot,msg) {
	let text = data[2][id] + '\n' + data[3][id];
	bot.sendMessage(msg.chat.id, text);
}

function createPoll(categories, bot, mid)
{
 let poll = {
         reply_markup: JSON.stringify({
          inline_keyboard: categories.map((x, id) => ([{
                text: x,
                callback_data: id,
        }]))
        })
        };
	console.log(poll.reply_markup);
	bot.sendMessage(mid, 'chose the but', poll);
}



module.exports = {
 translate: translate,
 editWiki: editWiki,
 createPoll: createPoll,
 sendText: sendText
};
