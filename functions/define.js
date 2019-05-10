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
wikiAPI+=word.split(' ').join('_');
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
//	console.log(categories);
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
 	//console.log(extract);
	extract = extract.filter( el =>  el.includes(' '));
	indexes = [];
	extract.forEach( (s, index) => {
	let start = s.indexOf('('),
	    end = s.indexOf(')');
	if(start && end)
	{
	var hasNumber = /\d/;
	if(hasNumber.test(s.slice(start,end)))
	extract[index] = s.slice(0,start);
}
});

}
});
// count indexes
//console.log(extract);
	extract.forEach((s, index) => {
	if(s.includes('=='))
	 indexes.push(index);
});

	extract.forEach((s, index) => { extract[index] = s.split(' ').join('_');});
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
//console.log(indexes);
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
