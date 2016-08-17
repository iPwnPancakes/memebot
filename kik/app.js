'use strict';
let bodyparser = require('body-parser');
let express = require('express');
var request = require('request');

let app = express();

app.use(bodyparser.json());

const username = 'memedelivery';
const key = '259135bf-b2eb-4dfd-9d41-0198fede2d47';

const MemeEnum = {
  KAPPA : {
    trigger : 'kappa',
    url : 'https://res.cloudinary.com/urbandictionary/image/upload/a_exif,c_fit,h_200,w_200/v1395991705/gjn81wvxqsq6yzcwubok.png'
  },
  BEANS : {
    trigger : 'bean em',
    url : 'https://pics.onsizzle.com/Facebook-308722.png'
  },
  ASS : {
    trigger : 'me',
    url : 'http://i.imgur.com/fupUJJa.png'
  },
  FARMER : {
    trigger : 'meme farmer',
    url : 'http://i.imgur.com/qzvLwgJ.png'
  },
  BEE : {
    trigger : 'kilk me',
    url : 'http://i.imgur.com/VtrvOFh.jpg'
  }
}

updateConfig();

app.get('/hello', function(req, res) {
  res.send('world!');
});

app.post('/incoming/', function(req, res) {
  let msg_events = req.body.messages;
  let messageText, sender, ChatID, currentMsg;
  for(let i = 0; i < msg_events.length; i++) {
    currentMsg = msg_events.shift();
    res.sendStatus(200);
    console.log('Text: ' + currentMsg.body + '\nSender: ' + currentMsg.from + '\nChatID: ' + currentMsg.chatId + '\n');
    /** Handle meme triggers. Default should be changed to doing nothing. Should still probably log the original message though.

    */
    if(currentMsg.body !== undefined) {
      switch(currentMsg.body.toLowerCase()) {
        case MemeEnum.KAPPA.trigger : sendPictureMessage(MemeEnum.KAPPA.url, currentMsg.from, currentMsg.chatId); break;
        case MemeEnum.BEANS.trigger : sendPictureMessage(MemeEnum.BEANS.url, currentMsg.from, currentMsg.chatId); break;
        case MemeEnum.ASS.trigger : sendPictureMessage(MemeEnum.ASS.url, currentMsg.from, currentMsg.chatId); break;
        case MemeEnum.FARMER.trigger : sendPictureMessage(MemeEnum.FARMER.url, currentMsg.from, currentMsg.chatId); break;
        case MemeEnum.BEE.trigger : sendPictureMessage(MemeEnum.BEE.url, currentMsg.from, currentMsg.chatId); break;
        case 'help' : sendTextMessage('Format [Meme, trigger]\nSupported memes: \nKappa:kappa\nBeans:bean em\nDatAss:me\nMemeFarmer:meme farmer\nBee:kilk me', currentMsg.from, currentMsg.chatId); break;
        default : sendTextMessage(currentMsg.body, currentMsg.from, currentMsg.chatId); break;
      }
    }
  }
});

app.listen(process.env.PORT || 8080);

function updateConfig() {
  request.post({
      url: "https://api.kik.com/v1/config",
      auth: {
          user: username,
          pass: key
      },
      json: {
          "webhook": "http://memebot-67815.onmodulus.net/incoming",
          "features": {
              "receiveReadReceipts": false,
              "receiveIsTyping": false,
              "manuallySendReadReceipts": false,
              "receiveDeliveryReceipts": false
          }
      }
  }, markComplete('Config'));
}

function sendTextMessage(body, receiver, ChatID) {
  request.post({
    url: "https://api.kik.com/v1/message",
    auth: {
        user: username,
        pass: key
    },
    json: {
        "messages": [
            {
                "body": body,
                "to": receiver,
                "type": "text",
                "chatId": ChatID
            }
        ]
    },
    delay: 1000
  }, markComplete('TxtMessage'));
}

function sendPictureMessage(url, receiver, ChatID) {
  request.post({
    url: "https://api.kik.com/v1/message",
    auth: {
        user: username,
        pass: key
    },
    json: {
        "messages": [
            {
                "to": receiver,
                "type": "picture",
                "picUrl": url,
                "chatId": ChatID
            }
        ]
    },
    delay: 1000
  }, markComplete('PicMessage'));
}

function markComplete(process) {
  console.log(process + ' ' + 'COMPREE');
}
