const rpc = require('node-json-rpc');

var options = {
    port: 5080,
    host: '127.0.0.1',
    path: '/',
    strict: true
};

// 创建client
let client = new rpc.Client(options);

exports.rpcClient = client;

