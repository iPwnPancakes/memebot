'use strict';

let util = require('util');
let http = require('http');
let Bot  = require('@kikinteractive/kik');

// Configure the bot API endpoint, details for your bot
let bot = new Bot({
    username: 'echo.bot',
    apiKey: '259135bf-b2eb-4dfd-9d41-0198fede2d47',
    baseUrl: 'https://github.com/iPwnPancakes/memebot.git'
});

bot.updateBotConfiguration();

bot.onTextMessage((message) => {
    message.reply(message.body); // Reply with the text they sent
});

// Set up your server and start listening
let server = http
    .createServer(bot.incoming())
    .listen(process.env.PORT || 8080);
