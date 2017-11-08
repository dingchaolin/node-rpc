let messenger = require("./messenger");

let server = messenger.createServer( 8082 );
let client = messenger.createClient(8080);

server.on( "news", function (m, data ) {
    let str = `收到广播者 [${data.ip}:${data.port}],内容:${JSON.stringify(data)}`;
    console.log( str );

});

server.on( "reply", function (m, data ) {
    let str = `收到订阅者 [${data.ip}:${data.port}]回执信息,内容:${JSON.stringify(data)}`;
    console.log( str );

});
setInterval(function(){
    client.shout('news', {ip: "127.0.0.1", port:8082});// => 8080
}, 2000);
