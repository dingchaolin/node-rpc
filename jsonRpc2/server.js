const rpc = require('json-rpc2');

let server = rpc.Server.$create({
    'websocket': true, // is true by default
    'headers': { // allow custom headers is empty by default
        'Access-Control-Allow-Origin': '*'
    }
});

function add(args, opt, callback) {
    callback(null, args[0] + args[1]);
}

server.expose('add', add);

// you can expose an entire object as well:

server.expose('myPath', {
    'add': function(args, opt, callback){ callback(null, args[0] + args[1]); },
    'mul': function(args, opt, callback){ callback(null, args[0] * args[1]);},
    'dec': function(args, opt, callback){ callback(null, args[0] / args[1]); }
});
// expects calls to be namespace.function1, namespace.function2 and namespace.function3

// listen creates an HTTP server on localhost only
server.listen(8000, 'localhost');
console.log("server listen on port 8000!");