let client = require('./client').rpcClient;
client.call('add', [1, 2], function(err, result) {
    console.log('1 + 2 = ' + result);
});

client.call('myPath.mul', [1, 2], function(err, result) {
    console.log('1 * 2 = ' + result);
});