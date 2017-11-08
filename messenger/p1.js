let messenger = require("./messenger");
let server = messenger.createServer( 8080 );
//let client =  messenger.createClient( 8081, 8082);

server.on( "news", (m, data ) => {
    let str = `收到:广播者 [${data.ip}:${data.port}],内容:${JSON.stringify(data)}`;
    console.log( str );
    let client =  messenger.createClient( 8081, 8082);
    client.shout( "reply", {ip:"127.0.0.1", port:8080, msg:"OK"});
});

