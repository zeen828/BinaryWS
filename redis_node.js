// socketio  node redis_node.js
var redis = require('redis');
var redisclient = redis.createClient();

redisclient.on('connect',function(){
    redisclient.set('author', 'testauthor', redis.print);
    redisclient.get('author', redis.print);
    redisclient.get('hello', redis.print);
});
