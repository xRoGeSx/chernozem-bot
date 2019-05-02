


function remind(value, bot, msg)
{
	let val = value.split(" ");
	if(val.length < 3 || !Number.isInteger(Number(val[0])) || !Number.isInteger(Number(val[1])) )
	{ bot.sendMessage(msg.chat.id, 'Команда должна иметь формат: \n /remind *часов* *минут* *сообщение*');
	  return;
	}
	console.log(msg.from, value);
	 bot.sendMessage(msg.from.id,( 'Напоминание будет осуществленно через: ' + val[0] + ' час. ' + val[1] + ' мин.') );
	 let hrs = Number(val[0]) * 1000 * 60 * 60;
	 let min = Number(val[1]) * 1000 * 60;
	 let timeout = hrs + min;
	 val.splice(0,2);
	 let reminder = "Бот напоминает вам: \n" + val.join(" ");
	setTimeout(function() { bot.sendMessage(msg.from.id, reminder); } , timeout )
}


module.exports = {
	remind: remind
};
