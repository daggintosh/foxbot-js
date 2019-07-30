const Discord = require('discord.js')
const client = new Discord.Client()
const randomcolour = require('randomcolor')
const youtube = require('ytdl-core')
const request = require('request');

const token = require("./token.json"); // BOT TOKEN
const config = require("./config.json") // CONFIG

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

const wolfPhrases = [
    "A wolf appears!", 
    "A wolf is here!", 
    "Theres a wolf here!", 
    "A wolf has manifested!",
    "A wolf has taken hold!",
    "There's a wolf in my boot!",
    "A wild wolf has appeared!",
    "A wolf challenges you!",
    "You see a wolf!",
    "Wow! A wolf!"
]

client.login(token.token)

client.on('ready', () => {
    console.log('Ready!')
    client.user.setActivity("foxes in " + client.guilds.size + " guilds", { type: 'LISTENING' })
})

let voiceActive = false

client.on('message', msg => {
    if(msg.content.indexOf(config.prefix) !== 0) return
    const filter = (reaction, user) => reaction.emoji.name === "➡" && user.id === msg.author.id || reaction.emoji.name === "⏹" && user.id === msg.author.id
    const argument = msg.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = argument.shift().toLowerCase()

    switch(command)
    {
        //#region about
        case "about":
            request("https://dagg.xyz/randomfox/", { json: true } , (error, response, body) => {
                let aboutEmbed = new Discord.RichEmbed()
                .setColor(randomcolour())
                .setThumbnail(body.link)
                .setTitle("GitHub")
                .setURL("https://github.com/dagg-1/foxbot-js")
                .setDescription("**Hello!**")
                .setAuthor("FoxBot", "https://cdn.discordapp.com/avatars/601967284394917900/f25955e890f89f1015762647f82ea555.webp")
                .setFooter(Date())
                msg.channel.send(aboutEmbed)
            })
            break;
        //#endregion

        //#region fox
        case "fox":
            fox()
            function fox()
            {
                request("https://dagg.xyz/randomfox/", { json: true } , (error, response, body) => { 
                    let foxEmbed = new Discord.RichEmbed()      
                    .setColor(randomcolour())
                    .setTitle(foxPhrases[Math.floor(Math.random()*foxPhrases.length)])
                    .setAuthor(msg.author.username, msg.author.avatarURL)
                    .setImage(body.link)
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
                }) 
            }
            break
        //#endregion

        //#region cat
        case "cat":
            cat()
            function cat()
            {
                request('http://aws.random.cat/meow', { json: true } , (error, response, body) => {   
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

        //#region wolf
        case "wolf":
            wolf()
            function wolf()
            {
                request("https://dagg.xyz/randomwolf/", { json: true } , (error, response, body) => { 
                    let wolfEmbed = new Discord.RichEmbed()      
                    .setColor(randomcolour())
                    .setTitle(wolfPhrases[Math.floor(Math.random()*foxPhrases.length)])
                    .setAuthor(msg.author.username, msg.author.avatarURL)
                    .setImage(body.link)
                    .setFooter(Date())
                    msg.channel.send(wolfEmbed)
                    .then(msg => {
                        msg.createReactionCollector(filter , { time: 60000 })
                        .on('collect', reaction => {
                            switch(reaction.emoji.name)
                            {
                                case "➡":
                                    msg.delete()
                                    wolf()
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
        
        //#region dog
        case "dog":
            dog()
            function dog()
            {
                request('https://dog.ceo/api/breeds/image/random', { json: true} , (error, response, body) => { 
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

        //#region time
        case "time":
            let timeEmbed = new Discord.RichEmbed()
            .setColor(randomcolour())
            .setDescription("**It's time to go to bed, you dolt.**")
            .setFooter(Date())
            .setAuthor(msg.author.username, msg.author.avatarURL)
            msg.channel.send(timeEmbed)
            break
        //#endregion

        //#region ping
        case "ping":
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
            .setDescription("Ping: " + "**" + Math.floor(pingMil) + "** milliseconds")
            .setFooter(Date())
            .setAuthor(msg.author.username, msg.author.avatarURL)
            msg.channel.send(pingEmbed)
            break
        //#endregion

        //#region help
        case "help":
            request("https://dagg.xyz/randomfox/", { json: true } , (error, response, body) => {
                let helpEmbed = new Discord.RichEmbed()
                .setColor(randomcolour())
                .addField(config.prefix + "help", "Displays this screen", true)
                .addField(config.prefix + "about", "About the bot", true)
                .addField(config.prefix + "ping", "Pong!", true)
                .addField(config.prefix + "time", "Tells the time", true)
                .addField(config.prefix + "fox", "Post a random fox", true)
                .addField(config.prefix + "cat", "Post a random cat", true)
                .addField(config.prefix + "dog", "Post a random dog", true)
                .addField(config.prefix + "wolf", "Post a random wolf", true)
                .addField(config.prefix + "play [YouTube URL]", "Plays a song", true)
                .setFooter(Date())
                .setAuthor(msg.author.username, msg.author.avatarURL)
                .setThumbnail(body.link)
                msg.channel.send(helpEmbed)
            })
            break
        //#endregion

        //#region play
        case "play":
            if (argument[0] == undefined){ msg.reply ("Do you want me to just scream?") }
            else if(voiceActive == true) { msg.reply("I'm already playing something!") }
            else if (msg.member.voiceChannel == undefined) { msg.reply("You aren't in a voice channel!") }
            else if(argument[0].includes("youtube.com/watch?v=") || argument[0].includes("https://youtu.be/")){
                let voiceChannel = msg.member.voiceChannel;
                let url = argument[0]
                let video = youtube(url)
                youtube.getInfo(url, (error, info) => {
                    console.log(info)
                    voiceChannel.join()
                    .then(connection => {
                        voiceActive = true;
                        let dispatch = connection.playStream(video)
                        dispatch.setVolume(0.5)
                        let ytEmbed = new Discord.RichEmbed()
                        .setAuthor(info.author.name, info.author.avatar)
                        .setFooter(Date())
                        .addField("**Now Playing**", info.video_id)
                        .setTitle(info.video_url)
                        .setURL(info.video_url)
                        .setColor(randomcolour())
                        msg.channel.send(ytEmbed)
                        .then(msg => {
                            dispatch.on('end', z => { voiceActive = false, msg.delete(), voiceChannel.leave(), connection.dispatcher.end()})
                            msg.createReactionCollector(filter , { time: null })
                            .on('collect', reaction => {
                                switch(reaction.emoji.name)
                                {
                                    case "⏹":
                                        voiceChannel.leave()
                                        break
                                }
                            })
                            msg.react("⏹")
                        })
                    })
                })
            }
            else { msg.reply("Invalid URL")}
            break
        //#endregion
    }
})
