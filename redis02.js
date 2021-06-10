const express = require('express');
const redis = require('redis');

const subscriber = redis.createClient();

const app = express();

subscriber.on('message', function(channel, message) {
    console.log('Received data：' + message);
})

subscriber.subscribe('private-channel-name');

app.get('/', function(req, res) {
    res.send('Subscriber One');
})

app.listen(3006, function() {
    console.log('Server is listening to port 3006');
})
