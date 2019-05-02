const axios = require('axios');
const encodeUrl = require('encodeurl');


let indexes = [];
let extract = [];

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
let wikiAPI ='https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=max&explaintext&exintr&redirects=&titles=';
if(word.split(" ").length > 1)
wikiAPI+=word.split(" ")[1];
else
{ wikiAPI+=word; }
console.log(wikiAPI);
axios.get(wikiAPI)
.then(response => {
let pag = response.data.query.pages;
extract = Object.values(pag)[0].extract;
let split = '';
if(extract.slice(0,100).includes("may refer to:"))
{
	//console.log("Disambiguation!")
	let categories = extract.split("\n").filter( el => el.includes('==') );
	let dialoge = {
	 reply_markup: JSON.stringify({
	  inline_keyboard: categories.map((x, xi) => ([{
		text: x,
		callback_data: xi,
	}]))
	})
	};
	extract = extract.split("\n").filter ( el => el!='');
	extract.forEach((s,index) => {
	extract[index] = s.split(',')[0];
});
	extract = extract.filter( el =>  el.includes(' '));
indexes = [];
	extract.forEach((s, index) => {
	if(s == categories[indexes.length])
	 indexes.push(index);
});
	extract.forEach((s, index) => { extract[index] = s.split(' ').join('_');})
	//console.log(indexes);
	//console.log(extract);
	bot.sendMessage(msg.chat.id, 'choose da button', dialoge);
}
else
{
split = extract.split('\n')[0];
do
{
let lastIndex = split.lastIndexOf(".")
split = split.substring(0, lastIndex);
} while(split.length > 500)
let bot_b = bot,
    msg_b = msg;
translate(split,'en|ru', (result, bot_b, msg_b) => {
	result+="\n"+'en.wikipedia.org/wiki/' + word;
	bot.sendMessage(msg.chat.id, result);
});
}
})
.catch(error => {
console.log(error);
});
};


function createPoll(id, bot, mid)
{
 let start = indexes[id];
 id++;
 let end = indexes[id];
 let t = extract.slice(start+1,end);
 let poll = {
         reply_markup: JSON.stringify({
          inline_keyboard: t.map((x) => ([{
                text: x,
                callback_data: x,
        }]))
        })
        };
	bot.sendMessage(mid, 'chose the but', poll);

}



module.exports = {
 translate: translate,
 editWiki: editWiki,
 createPoll: createPoll
};
