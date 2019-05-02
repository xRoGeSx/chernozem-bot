const axios = require('axios');

module.exports = {
get_weather: function(bot,msg)
{
//body
const weatherAPI = 'https://api.openweathermap.org/data/2.5/weather?q=Chernihiv,UA&appid=480d8a4b58734b1aff80fa7a5fb4799a&lang=ru&units=metric';
	axios.get(weatherAPI)
	 .then(response => {
	 let str = "Температура: " + response.data.main.temp.toString() + " °\n"
		 + "Ветер: " + response.data.wind.speed.toString() + " м/c\n"
		 + "Влажность: " + response.data.main.humidity.toString() + " мм.\n"
;
	 bot.sendMessage(msg.chat.id,str);
})
   .catch(error => { console.log(error)
});
//endbody
}
};
