var fs = require('fs');
var dataread = fs.readFileSync('Morphimon/data.json');
var data = JSON.parse(dataread);
// require the discord.js module
const Discord = require('discord.js');

// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});

// login to Discord with your app's token
client.login('NzIzMzMxODE0OTMxOTU1ODAy.XuwXTw.JvuDAqj6ft5uNcxw8B0tYXXE9Fo');

client.on('message', message => {
    //console.log(message.content);
    var userId = message.author.id;
    if (message.content === '!play') {
        // send back "Pong." to the channel the message was sent in
       
        if (!data[userId]) { //this checks if data for the user has already been created
            message.author.send('Welcome to Mophimon, a virtual pet simulator on discord!');
            message.author.send('Would you like to adopt a Morphimon?(yes/no)').then(() => {
            const filter = m => message.author.id === m.author.id;
            message.author.dmChannel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] })
                .then(messages => {
                    if (messages.first().content === 'yes') {
                        message.author.send('What would you like to name your Morphimon?').then(() => {
                            const filter = m => message.author.id === m.author.id;
                        
                            message.author.dmChannel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] })
                                .then(messages2 => {
                                    message.author.send('Congratulations on adopting ' + messages2.first().content + "!");
                                   
                                    if (!data[userId]) { //this checks if data for the user has already been created
                                        data[userId] = {MorphimonName: messages2.first().content, StartDate: Date(), LastInteractionTime: Date(), FoodLevel: 50, lastFeedingTime: 'Never', LastFoodCheckTime: Date()}; //if not, create it
                                        fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
                                    }
                                })
                                .catch(() => {
                                    message.author.send('You did not enter any input!');
                                });
                        }); 
                    }
                })
                .catch(() => {
                    message.author.send('You did not enter any input!');
                });
        });
        }
        else
        {
            var userId = message.author.id;
            message.author.send(data[userId].MorphimonName + ' is still alive');
            
            message.author.send('The last time you interacted with ' + data[userId].MorphimonName + ' was on ' + data[userId].LastInteractionTime );
            message.author.send('It has been ' + SecondDifference(data[userId].LastInteractionTime) + ' seconds since you last interacted with your Morphimon'); 
            CurrentFoodLevel(data[userId].LastFoodCheckTime, userId);
            message.author.send( data[userId].MorphimonName + "'s Food Level is at " + data[userId].FoodLevel + '%!');
            message.author.send('The last time you fed ' + data[userId].MorphimonName + ' was on ' + data[userId].lastFeedingTime );
            message.author.send('It has been ' + SecondDifference(data[userId].lastFeedingTime) + ' seconds since you last fed your Morphimon'); 
            
            data[userId].LastInteractionTime = Date();
            fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
        }
    }

    if (message.content === '!feed') {
        if (data[userId])
        {
            if( data[userId].FoodLevel < 100)
            {
                message.author.send('Feeding ' + data[userId].MorphimonName + ' 1 berry ...');
                CurrentFoodLevel(data[userId].LastFoodCheckTime, userId);
                data[userId].FoodLevel = data[userId].FoodLevel + 10;
                data[userId].lastFeedingTime = Date();
                data[userId].LastInteractionTime = Date();
                fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
               
                message.author.send( data[userId].MorphimonName + "'s Food Level is at " + data[userId].FoodLevel + '%!');

            }
            else
            {
                message.author.send(data[userId].MorphimonName + ' is already full!')
            }
           
        }
        else
        {
            message.author.send('Sorry you need a Morphimon first before you can feed it, type !play to get started')
        }
    }
});

function SecondDifference(olddate)
{
    const newDate = new Date();
    const oldDate = new Date(olddate);
    const YearDiff =  newDate.getFullYear() - oldDate.getFullYear();
    const MonthDiff =  (12 * YearDiff) + (newDate.getMonth() - oldDate.getMonth());
    const WeekDiff =  (4 * MonthDiff) + (newDate.getWeek() - oldDate.getWeek());
    const DayDiff =  (7 * WeekDiff) + (newDate.getDay() - oldDate.getDay());
    const HourDiff = (24 * DayDiff) + (newDate.getHours() - oldDate.getHours()); 
    const MinsDiff =  (60 * HourDiff) + (newDate.getMinutes() - oldDate.getMinutes());
    const SecsDiff =  (60 * MinsDiff) + (newDate.getSeconds() - oldDate.getSeconds());  

    return SecsDiff;
}

function MinuteDifference(olddate)
{
    const newDate = new Date();
    const oldDate = new Date(olddate);
    const YearDiff =  newDate.getFullYear() - oldDate.getFullYear();
    const MonthDiff =  (12 * YearDiff) + (newDate.getMonth() - oldDate.getMonth());
    const WeekDiff =  (4 * MonthDiff) + (newDate.getWeek() - oldDate.getWeek());
    const DayDiff =  (7 * WeekDiff) + (newDate.getDay() - oldDate.getDay());
    const HourDiff = (24 * DayDiff) + (newDate.getHours() - oldDate.getHours()); 
    const MinsDiff =  (60 * HourDiff) + (newDate.getMinutes() - oldDate.getMinutes());
 

    return MinsDiff;
}

function CurrentFoodLevel(Olddate, userId)
{
  var MinDif = MinuteDifference(Olddate);
  
  if (MinDif >=  data[userId].FoodLevel)
  {
    data[userId].FoodLevel = 0;
  }
  else
  {
    data[userId].FoodLevel = data[userId].FoodLevel - MinDif;
  }
  data[userId].LastFoodCheckTime = Date();
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
  
}
Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(),0,1);
    var today = new Date(this.getFullYear(),this.getMonth(),this.getDate());
    var dayOfYear = ((today - onejan + 86400000)/86400000);
    return Math.ceil(dayOfYear/7)
  };
