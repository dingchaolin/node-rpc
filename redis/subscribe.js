let Redis = require('ioredis');
let redis = new Redis();
let pub = new Redis();
let channels = require("./config").getConfig(3,0);
redis.subscribe(channels, function (err, count) {
    pub.publish(channels[0], "hello word");//client将member发布到news这个频道
});

redis.on('message', function (channel, message) {
    console.log('Receive message [%s] from channel [%s] ***********', message, channel);
    if( parseInt(channel) > 0 ){
        pub.publish("-"+channel, `${channels[channels.length-1]} 收到了 ${channel} 的订阅回执消息！`);
    }

});