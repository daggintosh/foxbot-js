const Discord = require('discord.js');
const client = new Discord.Client();

var token = "EDIT.TOKEN"

const foxPhrases = [
    "A fox appears!", 
    "A fox is here!", 
    "Theres a fox here!", 
    "A fox has manifested!",
    "A fox has taken hold!",
    "There's a fox in my boot!",
    "A wild fox has appeared!",
    "A fox challenges you!",
    "You see a fox!",
    "Wow! A fox!"
]

client.login(token);

client.on('ready', () => {
    console.log('Ready!');
})

client.on('message', msg => {
    switch(msg.content)
    {
        case "/fox":
            var foxEmbed = new Discord.RichEmbed()
            .setColor(Math.floor(Math.random() * 256),Math.floor(Math.random() * 256),Math.floor(Math.random() * 256))
            .setTitle(foxPhrases[Math.floor(Math.random()*foxPhrases.length)])
            .setAuthor(msg.author.username, msg.author.avatarURL)
            .setImage("https://dagg.xyz/randomfox/images/" + Math.floor(Math.random() * 126) + ".jpg")
            msg.channel.send(foxEmbed);
            break;
    }
})