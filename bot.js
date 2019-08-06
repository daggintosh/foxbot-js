// Hello, world!

const Discord = require('discord.js')
const client = new Discord.Client()
const randomcolour = require('randomcolor')
const youtube = require('ytdl-core')
const request = require('request')
const keyv = require('keyv')
const ytsearch = require('youtube-api-v3-search')

const token = require("./token.json") // BOT TOKEN
const mongoconf = require("./mongo.json") // MONGODB CONFIGURATION
const prefconf = require("./config.json") // DEFAULT PREFIX

const store = new keyv(`mongodb://${mongoconf.hostname}:${mongoconf.port}/${mongoconf.database}`)
const apitoken = token.apikey

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

let defaultPrefix = prefconf.defaultPrefix

let voiceActive = {}

client.login(token.token)

client.on('ready', async () => {
    console.log('Ready! Logged in as ' + client.user.username + '#' + client.user.discriminator)
    client.user.setActivity("foxes in " + client.guilds.size + " guilds", { type: 'LISTENING' })
    client.guilds.tap( async guild => {
        voiceActive[guild.id] = false
        var guildexists = await store.get(guild.id)
        if (guildexists == undefined)
        {
            await store.set(guild.id, defaultPrefix)
        }
    })
})

client.on('guildCreate', async guild => {
    client.user.setActivity("foxes in " + client.guilds.size + " guilds", { type: 'LISTENING' })
    console.log("The bot has joined " + guild.name)
    voiceActive[guild.id] = false
    await store.set(guild.id, defaultPrefix)
})

client.on('guildDelete', async guild => {
    client.user.setActivity("foxes in " + client.guilds.size + " guilds", { type: 'LISTENING' })
    console.log("The bot has left " + guild.name)
    await store.delete(guild.id)
})

client.on('disconnect', () => console.error("The bot has lost connection to the API."))

client.on('message', async msg => {
    if(msg.author.bot) return
    const filter = (reaction, user) => 
        reaction.emoji.name === "➡" && user.id === msg.author.id 
        || reaction.emoji.name === "⏹" && user.id === msg.author.id 
        || reaction.emoji.name === "🔁" && user.id === msg.author.id
        || reaction.emoji.name === "⏯" && user.id === msg.author.id

    if (msg.guild) {
        var prefix = await store.get(msg.member.guild.id)
        if (msg.content.indexOf(prefix) !== 0 ) return 
        if (msg.member.guild.me.hasPermission("MANAGE_MESSAGES") == false) return msg.reply("This bot requires message management to be enabled! It's used for and only for reaction handling.") 
        const argument = msg.content.slice(prefix.length).trim().split(/ +/g)
        const command = argument.shift().toLowerCase()
        let author = msg.author.id 
        switch(command)
        {
            //#region about
            case "about":
                request("https://dagg.xyz/randomfox/", { json: true } , (error, response, body) => {
                    let aboutDate = new Date()
                    let aboutEmbed = new Discord.RichEmbed()
                    .setColor(randomcolour())
                    .setThumbnail(body.link)
                    .setTitle("GitHub")
                    .setURL("https://github.com/dagg-1/foxbot-js")
                    .setDescription("**Hello!**")
                    .setAuthor("FoxBot", "https://cdn.discordapp.com/avatars/601967284394917900/f25955e890f89f1015762647f82ea555.webp")
                    .setFooter(aboutDate.toUTCString())
                    msg.channel.send(aboutEmbed)
                })
                break
            //#endregion

            //#region fox
            case "fox":
                let foxImage
                requestFox(z => postFox())
                function requestFox(callback)
                {
                    request("https://dagg.xyz/randomfox/", { json: true } , (error, response, body) => {
                        foxImage = body.link
                        callback()
                    })
                }
                function postFox()
                {
                    let foxDate = new Date()
                    let foxEmbed = new Discord.RichEmbed()      
                    .setColor(randomcolour())
                    .setTitle(foxPhrases[Math.floor(Math.random()*foxPhrases.length)])
                    .setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.avatarURL)
                    .setImage(foxImage)
                    .setFooter(foxDate.toUTCString())
                    msg.channel.send(foxEmbed)
                    .then(async msg => {
                        msg.createReactionCollector(filter , { time: null })
                        .on('collect', reaction => {
                            switch(reaction.emoji.name)
                            {
                                case "➡":
                                    requestFox(z => {})
                                    foxEmbed.setImage(foxImage)
                                    reaction.remove(author)
                                    msg.edit(foxEmbed)
                                    break
                                case "⏹":
                                    msg.delete()
                                    break
                            }
                        })
                            await msg.react("➡")
                            await msg.react("⏹")
                    })
                }
                break
            //#endregion

            //#region cat
            case "cat":
                let catImage
                requestCat(z => postCat())
                function requestCat(callback)
                {
                    request("http://aws.random.cat/meow", { json: true } , (error, response, body) => {
                        catImage = body.file
                        callback()
                    })
                }
                function postCat()
                {
                    let catDate = new Date() 
                    let catEmbed = new Discord.RichEmbed()      
                    .setColor(randomcolour())
                    .setTitle(catPhrases[Math.floor(Math.random()*catPhrases.length)])
                    .setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.avatarURL)
                    .setImage(catImage)
                    .setFooter(catDate.toUTCString())
                    msg.channel.send(catEmbed)
                    .then(async msg => {
                        msg.createReactionCollector(filter , { time: null })
                        .on('collect', reaction => {
                            switch(reaction.emoji.name)
                            {
                                case "➡":
                                    requestCat(z => {})
                                    catEmbed.setImage(catImage)
                                    reaction.remove(author)
                                    msg.edit(catEmbed)
                                    break
                                case "⏹":
                                    msg.delete()
                                    break
                            }
                        })
                            await msg.react("➡")
                            await msg.react("⏹")
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
                        let wolfDate = new Date()
                        let wolfEmbed = new Discord.RichEmbed()      
                        .setColor(randomcolour())
                        .setTitle(wolfPhrases[Math.floor(Math.random()*foxPhrases.length)])
                        .setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.avatarURL)
                        .setImage(body.link)
                        .setFooter(wolfDate.toUTCString())
                        msg.channel.send(wolfEmbed)
                        .then(async msg => {
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
                            await msg.react("➡")
                            await msg.react("⏹")
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
                        let dogDate = new Date()
                        let dogEmbed = new Discord.RichEmbed()
                        .setColor(randomcolour())
                        .setTitle(dogPhrases[Math.floor(Math.random()*dogPhrases.length)])
                        .setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.avatarURL)
                        .setImage(body.message)
                        .setFooter(dogDate.toUTCString())
                        msg.channel.send(dogEmbed)
                        .then(async msg => {
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
                            await msg.react("➡")
                            await msg.react("⏹")
                        })
                    })
                }
                break
            //#endregion

            //#region time
            case "time":
                let timeDate = new Date()
                let timeEmbed = new Discord.RichEmbed()
                .setColor(randomcolour())
                .setDescription("**It's time to go to bed, you dolt.**")
                .setFooter(timeDate.toUTCString())
                .setAuthor(msg.author.username, msg.author.avatarURL)
                msg.channel.send(timeEmbed)
                break
            //#endregion

            //#region ping
            case "ping":
                let pingDate = new Date()
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
                .setDescription("Ping: " + "**" + Math.floor(pingMil) + "** ms")
                .setFooter(pingDate.toUTCString())
                .setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.avatarURL)
                msg.channel.send(pingEmbed)
                break
            //#endregion

            //#region help
            case "help":
                request("https://dagg.xyz/randomfox/", { json: true } , (error, response, body) => {
                    let helpDate = new Date()
                    let helpEmbed = new Discord.RichEmbed()
                    .setColor(randomcolour())
                    .addField(prefix + "help", "Displays this screen", true)
                    .addField(prefix + "about", "About the bot", true)
                    .addField(prefix + "ping", "Pong!", true)
                    .addField(prefix + "time", "Tells the time", true)
                    .addField(prefix + "fox", "Post a random fox", true)
                    .addField(prefix + "cat", "Post a random cat", true)
                    .addField(prefix + "dog", "Post a random dog", true)
                    .addField(prefix + "wolf", "Post a random wolf", true)
                    .addField(prefix + "play [Search/URL]", "Plays a song", true)
                    .addField(prefix + "prefix [Prefix]", "Sets server prefix", true)
                    .addField(prefix + "info [User Mention]", "Gathers basic info of a user", true)
                    .addField(prefix + "kick [User Mention]", "Kicks a user from the guild", true)
                    .addField(prefix + "ban [User Mention]", "Bans a user from the guild", true)
                    .addField(prefix + "reset", "Resets the music bot in case of user or bot error", true)
                    .setFooter(helpDate.toUTCString())
                    .setAuthor("FoxBot", "https://cdn.discordapp.com/avatars/601967284394917900/f25955e890f89f1015762647f82ea555.webp")
                    .setThumbnail(body.link)
                    msg.channel.send(helpEmbed)
                })
                break
            //#endregion

            //#region play
            case "play":
                let repeat = "OFF"
                play()
                function play() {
                    if (argument[0] == undefined){ msg.reply ("Do you want me to just scream?") }
                    else if(voiceActive[msg.member.guild.id] == true) { msg.reply("I'm already playing something!") }
                    else if (msg.member.voiceChannel == undefined) { msg.reply("You aren't in a voice channel!") }
                    else if(argument[0].includes("youtube.com/watch?v=") || argument[0].includes("https://youtu.be/")){
                        let voiceChannel = msg.member.voiceChannel
                        let url = argument[0]
                        let video = youtube(url)
                        youtube.getInfo(url, (error, info) => {
                            let playPauseToggler = "play"
                            voiceChannel.join()
                            .then(connection => {
                                voiceActive[msg.member.guild.id] = true
                                let dispatch = connection.playStream(video)
                                dispatch.setVolume(0.5)
                                let ytEmbed = new Discord.RichEmbed()
                                .setAuthor(info.author.name, info.author.avatar)
                                .setFooter(info.player_response.videoDetails.viewCount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ` views | Repeat: ${repeat}`)
                                .addField("Now Playing", info.player_response.videoDetails.title)
                                .setThumbnail(info.player_response.videoDetails.thumbnail.thumbnails[0].url)
                                .setTitle(info.video_url)
                                .setURL(info.video_url)
                                .setColor("#ff1100")
                                msg.channel.send(ytEmbed)
                                .then(async msg => {
                                    dispatch.on('end', z => { 
                                        if (repeat === "ON") {
                                            voiceActive[msg.member.guild.id] = false,
                                            msg.delete(),
                                            play()
                                        }
                                        else {
                                            voiceActive[msg.member.guild.id] = false, 
                                            msg.delete(), 
                                            voiceChannel.leave(), 
                                            connection.dispatcher.end()
                                        }
                                    })
                                    msg.createReactionCollector(filter , { time: null })
                                    .on('collect', reaction => {
                                        switch(reaction.emoji.name)
                                        {
                                            case "⏹":
                                                repeat = "OFF"
                                                voiceChannel.leave()
                                                break
                                            case "🔁":
                                                reaction.remove(author)
                                                if(repeat === "OFF") {
                                                    repeat = "ON"
                                                    ytEmbed.setFooter(info.player_response.videoDetails.viewCount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ` views | Repeat: ${repeat}`)
                                                    msg.edit(ytEmbed)
                                                }
                                                else {
                                                    repeat = "OFF"
                                                    ytEmbed.setFooter(info.player_response.videoDetails.viewCount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ` views | Repeat: ${repeat}`)
                                                    msg.edit(ytEmbed)
                                                }
                                                break
                                            case "⏯":
                                                reaction.remove(author)
                                                if(playPauseToggler === "play") {
                                                    playPauseToggler = "pause"
                                                    dispatch.pause()
                                                }
                                                else {
                                                    playPauseToggler = "play"
                                                    dispatch.resume()
                                                }
                                                break
                                        }
                                    })
                                    await msg.react("⏯")
                                    await msg.react("⏹")
                                    await msg.react("🔁")
                                })
                            })
                        })
                    }
                    else {
                        let searchTerm = JSON.stringify(argument)
                        let filteredTerm = searchTerm.replace(/"|,|]|\[/gi, " ")
                        ytsearch(apitoken, { q:`${filteredTerm}`, part: "snippet", type: "video,playlist"}, (error, result) => {
                            if (result == undefined) { msg.reply("I've got nothing!"); return }
                            argument[0] = `https://youtu.be/${result.items[0].id.videoId}`
                            play()
                        })
                    }
                }
                break
            //#endregion

            //#region prefix
            case "prefix":
                if(argument[0] == undefined) {
                    msg.reply("The server prefix is currently: " + await store.get(msg.member.guild.id))
                }
                else {
                    if(msg.member.hasPermission("BAN_MEMBERS")){
                        await store.set(msg.member.guild.id, argument[0])
                        msg.reply("The server prefix is now: " + await store.get(msg.member.guild.id))
                    }
                    else {
                        msg.reply("You don't have the **BAN MEMBERS** permission!")
                    }
                }
                break
            //#endregion

            //#region info
            case "info":
                let infoDate = new Date()
                let infoEmbed = new Discord.RichEmbed()
                .setFooter(infoDate.toUTCString())
                if(argument[0] == undefined) {
                    infoEmbed.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.avatarURL)
                    .setThumbnail(msg.author.avatarURL)
                    .setTitle(`User Id: ${msg.author.id}`)
                    .addField("Account Created", msg.author.createdAt.toUTCString(), true)
                    .addField("User Joined", msg.member.joinedAt.toUTCString(), true)
                    .addField("Roles", msg.member.roles.map(z => z).join(", "), true)
                    .setColor(msg.member.colorRole.hexColor)
                    msg.channel.send(infoEmbed)
                }
                else if (msg.mentions.users.first()){
                    var mentionedUser = msg.mentions.users.first()
                    var mentionedMember = msg.guild.member(mentionedUser)
                    infoEmbed.setAuthor(`${mentionedUser.username}#${mentionedUser.discriminator}`, mentionedUser.avatarURL)
                    .setThumbnail(mentionedUser.avatarURL)
                    .setTitle(`User Id: ${mentionedUser.id}`)
                    .addField("Account Created", mentionedUser.createdAt.toUTCString())
                    .addField("User Joined", mentionedMember.joinedAt.toUTCString())
                    .addField("Roles", mentionedMember.roles.map(z => z).join(", "))
                    .setColor(mentionedMember.colorRole.hexColor)
                    msg.channel.send(infoEmbed)
                }
                else { msg.reply("Invalid Member") }
                break
            //#endregion

            //#region kick
            case "kick":
                let kickDate = new Date()
                var kickEmbed = new Discord.RichEmbed()
                .setFooter(kickDate.toUTCString())
                if(msg.member.guild.me.hasPermission("KICK_MEMBERS") == false)
                {
                    msg.reply("I do not have permissions to kick users.")
                    return
                }
                if(msg.member.hasPermission("KICK_MEMBERS") == false) {
                    msg.reply("You do not have permissions to kick users.")
                    return
                }
                else if (argument[0] == undefined) {
                    msg.reply("You did not mention a user!")
                    return
                }
                else if (msg.mentions.users.first()){
                    var mentionedUser = msg.mentions.users.first()
                    var mentionedMember = msg.guild.member(mentionedUser)
                    if (mentionedMember.id == client.user.id) {
                        msg.reply("I cannot kick myself!")
                        return
                    }
                    if (mentionedMember.kickable == false) {
                        msg.reply("This user has a kick shield.")
                    }
                    await mentionedMember.kick(argument[1])
                    kickEmbed.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.avatarURL)
                    .setTitle(`User Id: ${mentionedUser.id}`)
                    .addField("User Kicked", `${mentionedUser.username}#${mentionedUser.discriminator}`)
                    .setColor("#FFFF00")
                    msg.channel.send(kickEmbed)
                }
                else { msg.reply("Invalid Member") }
                break
            //#endregion

            //#region ban
            case "ban":
                let banDate = new Date()
                var banEmbed = new Discord.RichEmbed()
                .setFooter(banDate.toUTCString())
                if(msg.member.guild.me.hasPermission("BAN_MEMBERS") == false)
                {
                    msg.reply("I do not have permissions to ban users.")
                    return
                }
                if(msg.member.hasPermission("BAN_MEMBERS") == false) {
                    msg.reply("You do not have permissions to ban users.")
                    return
                }
                else if (argument[0] == undefined) {
                    msg.reply("You did not mention a user!")
                    return
                }
                else if (msg.mentions.users.first()){
                    var mentionedUser = msg.mentions.users.first()
                    var mentionedMember = msg.guild.member(mentionedUser)
                    if (mentionedMember.id == client.user.id) {
                        msg.reply("I cannot ban myself!")
                        return
                    }
                    if (mentionedMember.bannable == false) {
                        msg.reply("This user is immune to the ban hammer.")
                        return
                    }
                    await mentionedMember.ban(argument[1])
                    banEmbed.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.avatarURL)
                    .setTitle(`User Id: ${mentionedUser.id}`)
                    .addField("User Banned", `${mentionedUser.username}#${mentionedUser.discriminator}`)
                    .setColor("#FF0000")
                    msg.channel.send(banEmbed)
                }
                else { msg.reply("Invalid Member") }
                break
            //#endregion

            //#region reset
            case "reset":
                if(msg.member.hasPermission("MANAGE_MESSAGES")) { voiceActive = false}
                else { msg.reply("You do not have the ability to manage messages.") }
                break
            //#endregion
        }
    }
    else {
        msg.reply("Sorry, I don't support direct messages!")
    }
})
