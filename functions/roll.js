function roll(value,bot,msg)
{
	if(isNaN(value))
	{
	bot.sendMessage(msg.chat.id, 'Параметром команды должно быть число.'); return;
	}
	bot.sendMessage(msg.chat.id, ('Ваше случайное число: ' + Math.floor(Math.random() * (value))));
}

module.exports = {
 roll: roll
}
