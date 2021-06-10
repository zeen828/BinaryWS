const express = require('express');
const redis = require('redis');

const publisher = redis.createClient();

const app = express();

app.get('/', function(req, res) {
    const user = {
        id : '123456',
        name : 'Davis'
    }

    publisher.publish('private-channel-name', JSON.stringify(user))
    res.send('Publishing an Event using Redis');
})

app.listen(3005, function() {
    console.log('server is listening on PORT 3005');
})
