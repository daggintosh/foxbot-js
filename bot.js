const Discord = require('discord.js')
const client = new Discord.Client()
const randomcolour = require('randomcolor')

//#region Bot Token
var token = "EDIT.TOKEN"
//#endregion

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

client.login(token)

client.on('ready', () => {
    console.log('Ready!')
    client.user.setActivity("Foxes in " + client.guilds.size + " Guilds", { type: 'LISTENING' })
})

client.on('message', msg => {
    switch(msg.content)
    {
        //#region /about
        case "/about":
            var aboutEmbed = new Discord.RichEmbed()
            .setColor(randomcolour())
            .setThumbnail("https://dagg.xyz/randomfox/images/" + Math.floor(Math.random() * 125) + ".jpg")
            .setTitle("GitHub")
            .setURL("https://github.com/daggintosh/foxbot-js")
            .setDescription("**Hello!**")
            .setAuthor("FoxBot", "https://cdn.discordapp.com/avatars/601967284394917900/f25955e890f89f1015762647f82ea555.webp")
            .setFooter(Date())
            msg.channel.send(aboutEmbed)
            break;
        //#endregion

        //#region /fox
        case "/fox":
            fox()
            function fox()
            {
                var foxEmbed = new Discord.RichEmbed()
                .setColor(randomcolour())
                .setTitle(foxPhrases[Math.floor(Math.random()*foxPhrases.length)])
                .setAuthor(msg.author.username, msg.author.avatarURL)
                .setImage("https://dagg.xyz/randomfox/images/" + Math.floor(Math.random() * 125) + ".jpg")
                .setFooter(Date())
                let filterplay = (reaction, user) => reaction.emoji.name === "➡" && user.id === msg.author.id
                let filterstop = (reaction, user) => reaction.emoji.name === "⏹" && user.id === msg.author.id
                msg.channel.send(foxEmbed)
                .then(function(msg){
                    let collectorplay = msg.createReactionCollector(filterplay, { time: 60000 })
                    let collectorstop = msg.createReactionCollector(filterstop, { time: 60000 })
                    collectorplay.on('collect', z => {
                        msg.delete();
                        fox();
                    })
                    collectorstop.on('collect', z => {
                        msg.delete();
                    })
                    msg.react("➡")
                    .then(z =>{
                        msg.react("⏹")
                    })
                })     
            }
            break
        //#endregion
        
        //#region /time
        case "/time":
            var timeEmbed = new Discord.RichEmbed()
            .setColor(randomcolour())
            .setDescription("**It's time to go to bed, you dolt.**")
            .setFooter(Date())
            .setAuthor(msg.author.username, msg.author.avatarURL)
            msg.channel.send(timeEmbed)
            break
        //#endregion

        //#region /ping
        case "/ping":
            var pingMil = client.ping
            var pingColour = 0
            if(pingMil >= 200)
            {
                pingColour = "ff0000"
            }
            else if(pingMil >= 150)
            {
                pingColour = "f6ff00"
            }
            else if(pingMil < 150)
            {
                pingColour = "00ffe5"
            }
            var pingEmbed = new Discord.RichEmbed()
            .setColor(pingColour)
            .setDescription("Pong!")
            .addField("Ping from here to the server:", pingMil)
            .setFooter(Date())
            .setAuthor(msg.author.username, msg.author.avatarURL)
            msg.channel.send(pingEmbed)
            break
        //#endregion
    }
})

