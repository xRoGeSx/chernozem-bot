
module.exports = {
echo: function(bot,msg,string)
{
if(string.includes("Егор") || string.includes("егор"))
{   bot.sendMessage(msg.chat.id, (msg.from.first_name + " - отвратительный человек"));  }
else
	bot.sendMessage(msg.chat.id, string);
}
};
