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
  POGCHAMP : {
    trigger : 'pogchamp',
    url : 'http://ih1.redbubble.net/image.139973808.1307/flat,800x800,075,f.u3.jpg'
  },
  BEANS : {
    trigger : 'youve just been beaned',
    url : 'https://pics.onsizzle.com/Facebook-308722.png'
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
    if(currentMsg.body !== undefined {
      if(currentMsg.body.toLowerCase() === MemeEnum.KAPPA.trigger) {
       sendPictureMessage(MemeEnum.KAPPA.url, currentMsg.from, currentMsg.chatId);
      } else {
        sendTextMessage(currentMsg.body, currentMsg.from, currentMsg.chatId);
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
