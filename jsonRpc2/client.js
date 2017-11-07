const rpc = require('json-rpc2');

let client = rpc.Client.$create(8000, 'localhost');
exports.rpcClient = client;
