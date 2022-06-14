var fs = require('fs');
let request = require(`request`);
 
var dataread;
var data;

var totalMorphimon = 0;

var start =  false;
const dataChannelID = '724167400257224764';

// require the discord.js module
const Discord = require('discord.js');
console.log(Discord.version);
// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});

// login to Discord with your app's token
client.login('NzIzMzMxODE0OTMxOTU1ODAy.GUMVs2.B1kgc6PvcLAMWN8U_XVzK-lgt7mofVuP_kp85g').then(login => {
function download(url){
    request.get(url)
        .on('error', console.error)
        .pipe(fs.createWriteStream('Morphimon/data.json'))

}




function readData()
{
    client.channels.get(dataChannelID).fetchMessages({ limit: 1 }).then(messages0 => {
        let lastMessage = messages0.first();
        download(lastMessage.attachments.first().url);
        
    })
    .catch(console.error);

    try {
     
        dataread = fs.readFileSync('Morphimon/data.json');
       console.log(dataread);
       data = JSON.parse(dataread);
       fs.writeFileSync('Morphimon/data.json', JSON.stringify(data, null, 2));
    } catch (error) {
        console.log(error);
    }

    
}
readData();
})
.catch(console.error);




client.on('message', message => {


    function saveData()
    {
        client.channels.get(dataChannelID).fetchMessages({ limit: 1 }).then(messages3 => {
            let lastMessage = messages3.first();
            lastMessage.delete();
           // lastMessage.edit({
               // files: ['Morphimon/data.json']
         //   });
            
        })
        .catch(console.error);
        
        client.channels.get(dataChannelID).send({
            files: ['Morphimon/data.json']
        });

   
       client.user.setActivity(  totalMorphimon + " Morphimon!"); 
    }

    if(start == false)
    {
        console.log("start!"); 
        start = true;
        try {
     
            dataread = fs.readFileSync('Morphimon/data.json');
           console.log(dataread);
           data = JSON.parse(dataread);
           fs.writeFileSync('Morphimon/data.json', JSON.stringify(data, null, 2));
        } catch (error) {
            console.log(error);
        }

        totalMorphimon =  Object.keys(data).length;
        client.user.setActivity(  totalMorphimon + " Morphimon!"); 
       
    }

    
    
   
    //console.log(message.content);
    var userId = message.author.id;
    if (message.content === '!save') {
   
      saveData();
    }

    if (message.content === '!read') {
   
       //readData();
    }

    if (message.content === '!reset') {
   
        if (data[userId]) 
        {
            data[userId] = undefined;
            fs.writeFileSync('Morphimon/data.json', JSON.stringify(data, null, 2));
            totalMorphimon = totalMorphimon - 1;
            saveData();
            message.author.send('Your data has been deleted, type !play to play again');
        }
     }

     if (message.content === '!cmds') {
   
        message.channel.send('!play (to start game, or view info), !feed (to feed pet), !reset (to delete data and restart), !botinvite (for bot invite url), !credit (for who created it)');
     }

     if (message.content === '!botinvite') {
   
        message.channel.send('https://discord.com/oauth2/authorize?client_id=%20723331814931955802&&scope=bot');
     }

     if (message.content === '!credit') {
   
        message.channel.send('Created by morphmagicX on 6/18/2020, using the Discord.js library, github repository and heroku + repli.it servers');
     }

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
                           
                            SaveName();
                            function SaveName()
                            {
                                const filter = m => message.author.id === m.author.id;
                            message.author.dmChannel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] })
                                .then(messages2 => {
                                    if(messages2.last().content.length <= 50)
                                    {
                                            message.author.send('Congratulations on adopting ' + messages2.first().content + "!");
                                    
                                        if (!data[userId]) { //this checks if data for the user has already been created
                                            data[userId] = {MorphimonName: messages2.first().content, StartDate: Date(), LastInteractionTime: Date(), FoodLevel: 50, lastFeedingTime: 'Never', LastFoodCheckTime: Date()}; //if not, create it
                                            fs.writeFileSync('Morphimon/data.json', JSON.stringify(data, null, 2));
                                            totalMorphimon = totalMorphimon + 1;
                                            saveData();
                                        } 
                                    }
                                    else
                                    {
                                        message.author.send('Name can only be 50 Characters long, pls resubmit a shorter name below:').then(toolong=> {
                                            SaveName();
                                        })
                                        .catch(console.error);
                    
                                    }
                                   
                                })
                                .catch((error) => {
                                    console.log(error);
                                    message.author.send('You did not enter any input!');
                                });
                            }
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
            var status;
            CurrentFoodLevel(data[userId].LastFoodCheckTime, userId);
            if ( Math.round(data[userId].FoodLevel) < 50)
            {
                status = "Hungry";
            }
            else
            {
                status = "Good";
            }

            const InfoEmbed = new Discord.RichEmbed()
                .setColor('#0099ff')
                .setTitle('Pet Info') 
                .addField('Name: ', data[userId].MorphimonName )
                .attachFiles(['FirstMorphimon2.png'])
               .setImage('attachment://FirstMorphimon2.png')
                .addField('Food Level: ', Math.round(data[userId].FoodLevel) + "%")
                .addField('Last Feeding Time: ', MinuteDifference(data[userId].lastFeedingTime) + ' Minutes ago')//\n' + data[userId].lastFeedingTime)
                .addField('Last Interaction Time: ', MinuteDifference(data[userId].LastInteractionTime) + ' Minutes ago')//\n' + data[userId].LastInteractionTime)
                .addField('Status: ', status)
                message.author.send(InfoEmbed);
           // var userId = message.author.id;
            //message.author.send(data[userId].MorphimonName + ' is still alive');
            
            //message.author.send('The last time you interacted with ' + data[userId].MorphimonName + ' was on ' + data[userId].LastInteractionTime );
            //message.author.send('It has been ' + SecondDifference(data[userId].LastInteractionTime) + ' seconds since you last interacted with your Morphimon'); 
            //CurrentFoodLevel(data[userId].LastFoodCheckTime, userId);
            //message.author.send( data[userId].MorphimonName + "'s Food Level is at " + Math.round(data[userId].FoodLevel) + '%!');
            //message.author.send('The last time you fed ' + data[userId].MorphimonName + ' was on ' + data[userId].lastFeedingTime);
            //message.author.send('It has been ' + SecondDifference(data[userId].lastFeedingTime) + ' seconds since you last fed your Morphimon'); 
            
            data[userId].LastInteractionTime = Date();
            fs.writeFileSync('Morphimon/data.json', JSON.stringify(data, null, 2));
            saveData();
        }
    }

    if (message.content === '!feed') {
        if (data[userId])
        {
           if( (data[userId].lastFeedingTime === "Never" ) || (MinuteDifference(data[userId].lastFeedingTime) >= 60) )
           {
                if( data[userId].FoodLevel < 100)
                {
                    message.author.send('Feeding ' + data[userId].MorphimonName + ' 1 berry ...');
                    CurrentFoodLevel(data[userId].LastFoodCheckTime, userId);
                    if( data[userId].FoodLevel < 70)
                    {
                    data[userId].FoodLevel = data[userId].FoodLevel + 30;  
                    }
                    else
                    {
                        data[userId].FoodLevel = 100;    
                    }
                    
                    data[userId].lastFeedingTime = Date();
                    data[userId].LastInteractionTime = Date();
                    fs.writeFileSync('Morphimon/data.json', JSON.stringify(data, null, 2));
                    !saveData();
                 
                    message.author.send( data[userId].MorphimonName + "'s Food Level is at " + Math.round(data[userId].FoodLevel) + '%!');

                }
                else
                {
                    message.author.send(data[userId].MorphimonName + ' is already full!')
                }
            }
            else
            {
                message.author.send("You need to wait " + (60 - MinuteDifference(data[userId].lastFeedingTime)) + " minutes before you can feed your Morphimon again!")
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


function secondsDiff(d1, d2) {
   let millisecondDiff = d2 - d1;
   let secDiff = Math.floor( ( d2 - d1) / 1000 );
   return secDiff;
}

function MinuteDifference(Olddate) {
    d2 = new Date()
    d1 = new Date(Olddate)
     let seconds = secondsDiff(d1, d2);
     let minutesDiff = Math.floor( seconds / 60 );
     return minutesDiff;
}


function CurrentFoodLevel(Olddate, userId)
{
  var MinDif = MinuteDifference(Olddate);
  
  if (MinDif >=  1440)
  {
    data[userId].FoodLevel = 0; 
  }
  else
  {
    data[userId].FoodLevel = data[userId].FoodLevel - (MinDif/14.4);
  }
   data[userId].LastFoodCheckTime = Date();
  fs.writeFileSync('Morphimon/data.json', JSON.stringify(data, null, 2));
  
}
Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(),0,1);
    var today = new Date(this.getFullYear(),this.getMonth(),this.getDate());
    var dayOfYear = ((today - onejan + 86400000)/86400000);
    return Math.ceil(dayOfYear/7)
  };

 function JSONparsing()
 {
     
 }


