const kafka = require('kafka-node');
const Consumer = kafka.Consumer;
const Offset = kafka.Offset;
const Client = kafka.Client;

let topic = "IVU",
    client = new Client('192.168.64.180:12181'),
    topics = [{
        topic: topic,
        partition: 0,
        offset: 0
    }],
    options = {
        autoCommit: false,
        fetchMaxWaitMs: 1000,
        fetchMaxBytes: 1024 * 1024,
        fromOffset: true
    };

let consumer = new Consumer(client, topics, options);

consumer.on('message', function(message) {
    console.log("收到message", message, new Date().toLocaleString() );
});

consumer.on('error', function(err) {
    console.log('error', err);
});

