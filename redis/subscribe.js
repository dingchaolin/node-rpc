let Redis = require('ioredis');
let redis = new Redis();
let pub = new Redis();
let channels = require("./config").getConfig(3,0);
/*
每个订阅者的推送通道必须是唯一的，否则无法根据推送通道推送回执信息
 */
redis.subscribe(channels, function (err, count) {
    pub.publish(channels[0], "hello word");//client将member发布到news这个频道
});

redis.on('message', function (channel, message) {
    console.log('Receive message [%s] from channel [%s] ***********', message, channel);
    if( parseInt(channel) > 0 ){
        pub.publish("-"+channel, `${channels[channels.length-1]} 收到了 ${channel} 的订阅回执消息！`);
    }

});