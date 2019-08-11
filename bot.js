// Hello, world!

const Discord = require('discord.js')
const client = new Discord.Client()
const randomcolour = require('randomcolor')
const youtube = require('ytdl-core')
const axios = require('axios')
const keyv = require('keyv')
const ytsearch = require('youtube-api-v3-search')

const token = require("./token.json") // BOT TOKEN & YT API KEY
const mongoconf = require("./mongo.json") // MONGODB CONFIGURATION
const prefconf = require("./config.json") // DEFAULT PREFIX

const store = new keyv(`mongodb://${mongoconf.hostname}:${mongoconf.port}/${mongoconf.database}`)
const apitoken = token.apikey

const phrases = [
    "A animal appears!",
    "A animal is here!",
    "Theres a animal here!",
    "A animal has manifested!",
    "A animal has taken hold!",
    "There's a animal in my boot!",
    "A wild animal has appeared!",
    "A animal challenges you!",
    "You see a animal!",
    "Wow! A animal!",
    "Woah theres a animal over there!",
    "There appears to be a animal lurking about",
    "A animal appears before you!"
]
const animal = /animal/gi

const urls = {
    fox: { url: "https://dagg.xyz/randomfox", result: "link" },
    wolf: { url: "https://dagg.xyz/randomwolf", result: "link" },
    cat: { url: "http://aws.random.cat/meow", result: "file" },
    dog: { url: "https://dog.ceo/api/breeds/image/random", result: "message" }
}
let result

let defaultPrefix = prefconf.defaultPrefix

let voiceActive = {}

client.login(token.token)

client.on('ready', async () => {
    console.log('Ready! Logged in as ' + client.user.username + '#' + client.user.discriminator)
    client.user.setActivity("foxes in " + client.guilds.size + " guilds", { type: 'LISTENING' })
    client.guilds.tap(async guild => {
        voiceActive[guild.id] = false
        var guildexists = await store.get(guild.id)
        if (guildexists == undefined) {
            await store.set(guild.id, defaultPrefix)
        }
    })
})

client.on('guildCreate', async guild => {
    client.user.setActivity("foxes in " + client.guilds.size + " guilds", { type: 'LISTENING' })
    console.log("The bot has joined " + guild.name)
    queue.set(guild.id, "")
    voiceActive[guild.id] = false
    await store.set(guild.id, defaultPrefix)
})

client.on('guildDelete', async guild => {
    client.user.setActivity("foxes in " + client.guilds.size + " guilds", { type: 'LISTENING' })
    console.log("The bot has left " + guild.name)
    queue.set(guild.id, "")
    await store.delete(guild.id)
})

client.on('disconnect', () => console.error("The bot has lost connection to the API."))

client.on('message', async msg => {
    if (msg.author.bot) return
    if (msg.guild) {
        var prefix = await store.get(msg.member.guild.id)
        if (msg.content.indexOf(prefix) !== 0) return
        if (msg.member.guild.me.hasPermission("MANAGE_MESSAGES") == false) return msg.reply("This bot requires message management to be enabled! It's used for and only for reaction handling.")
        const argument = msg.content.slice(prefix.length).trim().split(/ +/g)
        const command = argument.shift().toLowerCase()
        let author = msg.author.id
        switch (command) {
            //#region about
            case "about":
                animalimg = "fox"
                result = await requestimg(animalimg)
                let aboutDate = new Date()
                let aboutEmbed = new Discord.RichEmbed()
                    .setColor("#fc9403")
                    .setThumbnail(result)
                    .setTitle("GitHub")
                    .setURL("https://github.com/dagg-1/foxbot-js")
                    .setDescription("**Hello!**")
                    .setAuthor("FoxBot", "https://cdn.discordapp.com/avatars/601967284394917900/f25955e890f89f1015762647f82ea555.webp")
                    .setFooter(aboutDate.toUTCString())
                msg.channel.send(aboutEmbed)
                break
            //#endregion

            //#region fox - cat - wolf - dog
            case "fox":
                animalimg = "fox"
                sendimg(animalimg, msg)
                break

            case "cat":
                animalimg = "cat"
                sendimg(animalimg, msg)
                break

            case "wolf":
                animalimg = "wolf"
                sendimg(animalimg, msg)
                break

            case "dog":
                animalimg = "dog"
                sendimg(animalimg, msg)
                break
            //#endregion

            //#region time
            case "time":
                let timeDate = new Date()
                let timeEmbed = new Discord.RichEmbed()
                    .setColor(randomcolour())
                    .addField("Time:", timeDate.toUTCString().substr(16, 28), true)
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
                if (pingMil >= 200) {
                    pingColour = "ff0000"
                }
                else if (pingMil >= 150) {
                    pingColour = "f6ff00"
                }
                else if (pingMil < 150) {
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
                animalimg = "fox"
                result = await requestimg(animalimg)
                let helpDate = new Date()
                let helpEmbed = new Discord.RichEmbed()
                    .setColor("#fc9403")
                    .addField(`${prefix}help`, "Displays this screen", true)
                    .addField(`${prefix}about`, "About the bot", true)
                    .addField(`${prefix}ping`, "Pong!", true)
                    .addField(`${prefix}time` + "time", "Tells the time", true)
                    .addField(`${prefix}fox`, "Post a random fox", true)
                    .addField(`${prefix}cat`, "Post a random cat", true)
                    .addField(`${prefix}dog`, "Post a random dog", true)
                    .addField(`${prefix}wolf`, "Post a random wolf", true)
                    .addField(`${prefix}play [Search/URL]`, "Play a song", true)
                    .addField(`${prefix}prefix [Prefix]`, "Set server prefix", true)
                    .addField(`${prefix}info [User Mention]`, "Gather basic info of a user", true)
                    .addField(`${prefix}kick [User Mention]`, "Kick a user from the guild", true)
                    .addField(`${prefix}ban [User Mention]`, "Ban a user from the guild", true)
                    .addField(`${prefix}reset`, "Reset the music bot in case of user or bot error", true)
                    .addField(`${prefix}rng [Min] [Max] or [Max]`, "Post a random number", true)
                    .setFooter(helpDate.toUTCString())
                    .setAuthor("FoxBot", "https://cdn.discordapp.com/avatars/601967284394917900/f25955e890f89f1015762647f82ea555.webp")
                    .setThumbnail(result)
                msg.channel.send(helpEmbed)
                break
            //#endregion

            //#region play
            case "play":
                let repeat = "OFF"
                let volume = 0.5
                music(argument, msg, volume, repeat, author)
                break
            //#endregion

            //#region prefix
            case "prefix":
                if (argument[0] == undefined) {
                    msg.reply("The server prefix is currently: " + await store.get(msg.member.guild.id))
                }
                else {
                    if (msg.member.hasPermission("BAN_MEMBERS")) {
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
                let rolecolor
                let infoDate = new Date()
                let infoEmbed = new Discord.RichEmbed()
                    .setFooter(infoDate.toUTCString())
                if (argument[0] == undefined) {
                    if (msg.member.colorRole == undefined) rolecolor = "#b5b5b5"
                    else rolecolor = msg.member.displayColor
                    infoEmbed.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.avatarURL)
                        .setThumbnail(msg.author.avatarURL)
                        .setTitle(`User Id: ${msg.author.id}`)
                        .addField("Account Created", msg.author.createdAt.toUTCString(), true)
                        .addField("User Joined", msg.member.joinedAt.toUTCString(), true)
                        .addField("Roles", msg.member.roles.map(z => z).join(", "), true)
                        .setColor(rolecolor)
                    msg.channel.send(infoEmbed)
                }
                else if (msg.mentions.users.first()) {
                    var mentionedUser = msg.mentions.users.first()
                    var mentionedMember = msg.guild.member(mentionedUser)
                    if (mentionedMember.colorRole == undefined) rolecolor = "#b5b5b5"
                    else rolecolor = mentionedMember.displayColor
                    infoEmbed.setAuthor(`${mentionedUser.username}#${mentionedUser.discriminator}`, mentionedUser.avatarURL)
                        .setThumbnail(mentionedUser.avatarURL)
                        .setTitle(`User Id: ${mentionedUser.id}`)
                        .addField("Account Created", mentionedUser.createdAt.toUTCString(), true)
                        .addField("User Joined", mentionedMember.joinedAt.toUTCString(), true)
                        .addField("Roles", mentionedMember.roles.map(z => z).join(", "), true)
                        .setColor(rolecolor)
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
                if (msg.member.guild.me.hasPermission("KICK_MEMBERS") == false) {
                    msg.reply("I do not have permissions to kick users.")
                    return
                }
                if (msg.member.hasPermission("KICK_MEMBERS") == false) {
                    msg.reply("You do not have permissions to kick users.")
                    return
                }
                if (argument[0] == undefined) {
                    msg.reply("You did not mention a user!")
                    return
                }
                if (msg.mentions.users.first()) {
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
                if (msg.member.guild.me.hasPermission("BAN_MEMBERS") == false) {
                    msg.reply("I do not have permissions to ban users.")
                    return
                }
                if (msg.member.hasPermission("BAN_MEMBERS") == false) {
                    msg.reply("You do not have permissions to ban users.")
                    return
                }
                if (argument[0] == undefined) {
                    msg.reply("You did not mention a user!")
                    return
                }
                if (msg.mentions.users.first()) {
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
                if (msg.member.hasPermission("MANAGE_MESSAGES")) { voiceActive = false }
                else { msg.reply("You do not have the ability to manage messages.") }
                break
            //#endregion

            //#region rng
            case "rng":
                if (argument[0] == undefined) return msg.channel.send(`Usage: ${prefix}rng [MAX] or ${prefix}rng [MIN] [MAX]`)
                let rngEmbed = new Discord.RichEmbed()
                let rngTime = new Date().toUTCString()
                rngEmbed.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.avatarURL)
                    .setTitle("Random Number Generator")
                    .setColor(randomcolour())
                    .setFooter(rngTime)
                let rngarg
                switch (argument.length) {
                    case 1:
                        rngEmbed.setDescription(Math.floor(Math.random() * argument[0]) + 1)
                        rngarg = 1
                        break
                    case 2:
                        rngEmbed.setDescription(Math.floor(Math.random() * (Math.floor(argument[1]) - Math.ceil(argument[0])) + Math.ceil(argument[0])))
                        rngarg = 2
                        break
                    default:
                        msg.reply("Please use only two arguments!")
                        return
                }
                msg.channel.send(rngEmbed)
                    .then(async msg => {
                        msg.createReactionCollector(filter, { time: null })
                            .on('collect', async reaction => {
                                switch (reaction.emoji.name) {
                                    case "➡":
                                        switch (rngarg) {
                                            case 1:
                                                rngEmbed.setDescription(Math.floor(Math.random() * argument[0]) + 1)
                                                break
                                            case 2:
                                                rngEmbed.setDescription(Math.floor(Math.random() * (Math.floor(argument[1]) - Math.ceil(argument[0])) + Math.ceil(argument[0])))
                                                break
                                        }
                                        reaction.remove(author)
                                        msg.edit(rngEmbed)
                                        break
                                    case "⏹":
                                        msg.delete()
                                        break
                                }
                            })
                        await msg.react("➡")
                        await msg.react("⏹")
                    })
                break
            //#endregion
        }
    }
    else {
        msg.reply("Sorry, I don't support direct messages!")
    }
})

async function requestimg(animalimg) {
    const info = urls[animalimg];
    return (await axios.get(info.url)).data[info.result];
}

async function sendimg(animalimg, msg) {
    let author = msg.author.id
    const imgfilter = (reaction, user) => [reaction.emoji.name === "➡", reaction.emoji.name === "⏹"] && user.id === msg.author.id
    postimg()
    async function postimg() {
        result = await requestimg(animalimg)
        let date = new Date()
        let embed = new Discord.RichEmbed()
            .setTitle(phrases[Math.floor(Math.random() * phrases.length)].replace(animal, animalimg))
            .setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.avatarURL)
            .setImage(result)
            .setFooter(date.toUTCString())
        switch (animalimg) {
            case "fox":
                embed.setColor("#fc9403")
                break
            case "dog":
                embed.setColor("#ffe419")
                break
            case "wolf":
                embed.setColor("#b5b5b5")
                break
            case "cat":
                embed.setColor("#2b2b2b")
                break
        }
        msg.channel.send(embed)
            .then(async msg => {
                msg.createReactionCollector(imgfilter, { time: null })
                    .on('collect', async reaction => {
                        switch (reaction.emoji.name) {
                            case "➡":
                                result = await requestimg(animalimg)
                                embed.setImage(result)
                                reaction.remove(author)
                                msg.edit(embed)
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
}

function music(argument, msg, volume, repeat, author) {
    const ytFilter = (reaction, user) =>
    [reaction.emoji.name === "⏹",
    reaction.emoji.name === "🔁",
    reaction.emoji.name === "⏯",
    reaction.emoji.name === "⬆",
    reaction.emoji.name === "⬇"] && user.id === msg.author.id
    if (argument[0] == undefined) { msg.reply("Do you want me to just scream?") }
    else if (voiceActive[msg.member.guild.id] == true) { msg.reply("I'm already playing something!") }
    else if (msg.member.voiceChannel == undefined) { msg.reply("You aren't in a voice channel!") }
    else if (msg.member.voiceChannel.joinable == false) { msg.reply("I cannot join this channel!") }
    else if (argument[0].includes("youtube.com/watch?v=") || argument[0].includes("https://youtu.be/")) {
        let voiceChannel = msg.member.voiceChannel
        let follow = setInterval(z => {
            if (msg.member.voiceChannel == undefined) return clearInterval(follow)
            if (msg.member.voiceChannel.joinable == false) clearInterval(follow), msg.reply("I can't join this channel, I will no longer follow you.")
            if (voiceChannel != msg.member.voiceChannel && msg.member.voiceChannel.joinable == true) {
                voiceChannel = msg.member.voiceChannel
                voiceChannel.join()
            }
        }, 1000)
        let url = argument[0]
        let video = youtube(url, { highWaterMark: 1 << 25 })
        youtube.getInfo(url, (error, info) => {
            let playPauseToggler = "PLAYING"
            voiceChannel.join()
                .then(connection => {
                    voiceActive[msg.member.guild.id] = true
                    let dispatch = connection.playStream(video)
                    dispatch.setVolume(volume)
                    let ytEmbed = new Discord.RichEmbed()
                        .setAuthor(info.author.name, info.author.avatar)
                        .setFooter(`👁 ${info.player_response.videoDetails.viewCount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} views`)
                        .addField("🎵 Now Playing", info.player_response.videoDetails.title)
                        .addField("🔈 Volume", dispatch.volume, true)
                        .addField("🔁 Repeat", repeat, true)
                        .addField("ℹ Status", playPauseToggler, true)
                        .setImage(info.player_response.videoDetails.thumbnail.thumbnails[3].url)
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
                                        clearInterval(follow),
                                        msg.delete(),
                                        voiceChannel.leave(),
                                        connection.dispatcher.end()
                                }
                            })
                            msg.createReactionCollector(ytFilter, { time: null })
                                .on('collect', reaction => {
                                    switch (reaction.emoji.name) {
                                        case "⏹":
                                            repeat = "OFF"
                                            voiceChannel.leave()
                                            break
                                        case "🔁":
                                            reaction.remove(author)
                                            if (repeat === "OFF") {
                                                repeat = "ON"
                                                ytEmbed.fields[2] = { name: "🔁 Repeat", value: repeat, inline: true }
                                                msg.edit(ytEmbed)
                                            }
                                            else {
                                                repeat = "OFF"
                                                ytEmbed.fields[2] = { name: "🔁 Repeat", value: repeat, inline: true }
                                                msg.edit(ytEmbed)
                                            }
                                            break
                                        case "⏯":
                                            reaction.remove(author)
                                            if (playPauseToggler === "PLAYING") {
                                                playPauseToggler = "PAUSED"
                                                ytEmbed.fields[3] = { name: "ℹ Status", value: playPauseToggler, inline: true }
                                                msg.edit(ytEmbed)
                                                dispatch.pause()
                                            }
                                            else {
                                                playPauseToggler = "PLAYING"
                                                ytEmbed.fields[3] = { name: "ℹ Status", value: playPauseToggler, inline: true }
                                                msg.edit(ytEmbed)
                                                dispatch.resume()
                                            }
                                            break
                                        case "⬆":
                                            reaction.remove(author)
                                            volume = (volume * 10 + 0.1 * 10) / 10
                                            dispatch.setVolume(volume)
                                            ytEmbed.fields[1] = { name: "🔈 Volume", value: volume.toString(), inline: true }
                                            msg.edit(ytEmbed)
                                            break
                                        case "⬇":
                                            reaction.remove(author)
                                            volume = (volume * 10 - 0.1 * 10) / 10
                                            dispatch.setVolume(volume)
                                            ytEmbed.fields[1] = { name: "🔈 Volume", value: volume.toString(), inline: true }
                                            msg.edit(ytEmbed)
                                            break
                                    }
                                })
                            await msg.react("⏯")
                            await msg.react("⏹")
                            await msg.react("🔁")
                            await msg.react("⬆")
                            await msg.react("⬇")
                        })
                })
        })
    }
    else {
        let searchTerm = JSON.stringify(argument)
        let filteredTerm = searchTerm.replace(/"|,|]|\[/gi, " ").replace(/\s+/g, " ").trim()
        ytsearch(apitoken, { q: `${filteredTerm}`, part: "snippet", type: "video,playlist" }, (error, result) => {
            if (result == undefined) { msg.reply("I've got nothing!"); return }
            argument[0] = `https://youtu.be/${result.items[0].id.videoId}`
            music(argument, msg, volume, repeat, author)
        })
    }
}