let client = require('./client').rpcClient;



for( let i = 1; i < 20; i++ ){
    client.call(
        {   "jsonrpc": "2.0",
            "method": "add",
            "params": [1,i],
            "id": i //id必须非零
        },
        function (err, res) {
            if (err) { console.log(err); }
            else { console.log("i========>",res.result); }
        }
    );
}