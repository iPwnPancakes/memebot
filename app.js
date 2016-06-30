var express = require('express');
var app = express();

app.get('/hello', function() {
  res.send('world!');
})

app.post('/webhook', function(req, res) {
  res.send('hello world!');
});
