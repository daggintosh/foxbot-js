const Discord = require('discord.js');
const client = new Discord.Client();

var token = "EDIT.TOKEN"

client.login(token);

client.on('ready', () => {
    console.log('Ready!');
})