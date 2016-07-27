var bodyParser = require('body-parser');
var express = require('express');
var request = require('request');

var app = express();

app.use(bodyParser.json());

//Test
app.get('/hello', function(req, res) {
  res.send('world!');
});

// To verify
app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === 'fluffybuns') {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

// To listen for messages
app.post('/webhook/', function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      console.log(text);
      if (text.toLowerCase().indexOf('kappa') > -1) {
      var kappaPictureURL = 'https://res.cloudinary.com/urbandictionary/image/upload/a_exif,c_fit,h_200,w_200/v1395991705/gjn81wvxqsq6yzcwubok.png';
        sendImageMessage(sender, kappaPictureURL);
      }
      else if (text.toLowerCase().indexOf('pogchamp') > -1) {
        var pogchampPictureURL = 'http://ih1.redbubble.net/image.139973808.1307/flat,800x800,075,f.u3.jpg';
        sendImageMessage(sender, pogchampPictureURL);
      }
      else {
        sendTextMessage(sender, text);
      }
    }
  }
  // Assume all went well.
  //
  // You must send back a 200, within 20 seconds, to let us know you've
  // successfully received the callback. Otherwise, the request will time out.
  res.sendStatus(200);
});

function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };
  callSendAPI(messageData);
}

function sendImageMessage(recipientId, imgURL) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: 'image',
        payload: {
          url: imgURL
        }
      }
    }
  };
  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: 'EAAECjXmv3f8BAHbuUZBe2XE0Rhfv3likkU0RcASrmDfbZAN9Q0moRZBGwXpZBWX7Q1ykwPxZB78xwL5Otrjzq321TNTB4D6o9RqkBx7plJ8lP3j2xtAzE3NCFEYwFRZCxMxHuyZAVZBOzsYoAYiNALdWkQtTVk0737Syv2vjAsygPwZDZD' },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });
}

app.listen(process.env.PORT);
