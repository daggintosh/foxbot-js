const Discord = require('discord.js')
const client = new Discord.Client()
const randomcolour = require('randomcolor')
const request = require('request');

const embed = new Discord.RichEmbed()

//#region Bot Token
var token = "TOKEN"
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

const catPhrases = [
    "A cat appears!", 
    "A cat is here!", 
    "Theres a cat here!", 
    "A cat has manifested!",
    "A cat has taken hold!",
    "There's a cat in my boot!",
    "A wild cat has appeared!",
    "A cat challenges you!",
    "You see a cat!",
    "Wow! A cat!"
]

const dogPhrases = [
    "A dog appears!", 
    "A dog is here!", 
    "Theres a dog here!", 
    "A dog has manifested!",
    "A dog has taken hold!",
    "There's a dog in my boot!",
    "A wild dog has appeared!",
    "A dog challenges you!",
    "You see a dog!",
    "Wow! A dog!"
]

client.login(token)

client.on('ready', () => {
    console.log('Ready!')
    client.user.setActivity("Foxes in " + client.guilds.size + " Guilds", { type: 'LISTENING' })
})

client.on('message', msg => {
    const filter = (reaction, user) => reaction.emoji.name === "➡" && user.id === msg.author.id || reaction.emoji.name === "⏹" && user.id === msg.author.id
    switch(msg.content)
    {
        //#region /about
        case "/about":
            let aboutEmbed = new Discord.RichEmbed()
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
                let foxEmbed = new Discord.RichEmbed()
                .setColor(randomcolour())
                .setTitle(foxPhrases[Math.floor(Math.random()*foxPhrases.length)])
                .setAuthor(msg.author.username, msg.author.avatarURL)
                .setImage("https://dagg.xyz/randomfox/images/" + Math.floor(Math.random() * 125) + ".jpg")
                .setFooter(Date())
                msg.channel.send(foxEmbed)
                .then(msg => {
                    msg.createReactionCollector(filter , { time: 60000 })
                    .on('collect', reaction => {
                        switch(reaction.emoji.name)
                        {
                            case "➡":
                                msg.delete()
                                fox()
                                break
                            case "⏹":
                                msg.delete()
                                break
                        }
                    })
                    msg.react("➡")
                    .then(z =>{
                        msg.react("⏹")
                    })
                })     
            }
            break
        //#endregion

        //#region /cat
        case "/cat":
            cat()
            function cat()
            {
                request('http://aws.random.cat/meow', { json: true} , (err, res, body) => {   
                    let catEmbed = new Discord.RichEmbed()      
                    .setColor(randomcolour())
                    .setTitle(catPhrases[Math.floor(Math.random()*catPhrases.length)])
                    .setAuthor(msg.author.username, msg.author.avatarURL)
                    .setImage(body.file)
                    .setFooter(Date())
                    msg.channel.send(catEmbed)
                    .then(msg => {
                        msg.createReactionCollector(filter , { time: 60000 })
                        .on('collect', reaction => {
                            switch(reaction.emoji.name)
                            {
                                case "➡":
                                    msg.delete()
                                    cat()
                                    break
                                case "⏹":
                                    msg.delete()
                                    break
                            }
                        })
                        msg.react("➡")
                        .then(z =>{
                            msg.react("⏹")
                        })
                    })
                })
            }
            break
        //#endregion
        
        //#region /dog
        case "/dog":
            dog()
            function dog()
            {
                request('https://dog.ceo/api/breeds/image/random', { json: true} , (err, res, body) => { 
                    let dogEmbed = new Discord.RichEmbed()
                    .setColor(randomcolour())
                    .setTitle(dogPhrases[Math.floor(Math.random()*dogPhrases.length)])
                    .setAuthor(msg.author.username, msg.author.avatarURL)
                    .setImage(body.message)
                    .setFooter(Date())
                    msg.channel.send(dogEmbed)
                    .then(msg => {
                        msg.createReactionCollector(filter , { time: 60000 })
                        .on('collect', reaction => {
                            switch(reaction.emoji.name)
                            {
                                case "➡":
                                    msg.delete()
                                    dog()
                                    break
                                case "⏹":
                                    msg.delete()
                                    break
                            }
                        })
                        msg.react("➡")
                        .then(z =>{
                            msg.react("⏹")
                        })
                    })
                })
            }
            break
        //#endregion

        //#region /time
        case "/time":
            let timeEmbed = new Discord.RichEmbed()
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
            let pingEmbed = new Discord.RichEmbed()
            .setColor(pingColour)
            .setDescription("Ping: " + "**" + pingMil + "** milliseconds")
            .setFooter(Date())
            .setAuthor(msg.author.username, msg.author.avatarURL)
            msg.channel.send(pingEmbed)
            break
        //#endregion

        //#region /help
        case "/help":
            let helpEmbed = new Discord.RichEmbed()
            .setColor(randomcolour())
            .addField("/about", "About the bot", true)
            .addField("/ping", "Pong!", true)
            .addField("/time", "Tells the time", true)
            .addField("/fox", "Post a random fox", true)
            .addField("/cat", "Post a random cat", true)
            .addField("/dog", "Post a random dog", true)
            .setFooter(Date())
            .setAuthor(msg.author.username, msg.author.avatarURL)
            .setThumbnail("https://dagg.xyz/randomfox/images/" + Math.floor(Math.random() * 125) + ".jpg")
            msg.channel.send(helpEmbed)
            break
        //#endregion
    }
})

