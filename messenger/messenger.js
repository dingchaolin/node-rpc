const messenger = require('messenger');

exports.createServer = function (port, host = "127.0.0.1"){
    return messenger.createListener(port);
}

exports.createClient = function( port1, port2 ){
    if( port2 ){
        return messenger.createSpeaker(port1, port2);
    }
    return messenger.createSpeaker(port1);

}

