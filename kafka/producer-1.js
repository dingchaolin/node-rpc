const kafka = require('kafka-node');
const Producer = kafka.Producer;
const Client = kafka.Client;
let  client = new Client('192.168.64.185:12181');

let topic = "NI_HAO_SE_CAI",
    producer = new Producer(client, {
    requireAcks: 1
});



let onReady = function(){
    return new Promise( (resolve, reject) => {
        producer.on('ready', function() {

            producer.createTopics([topic], function (err, data) {
                if( err ){
                    reject( 0 );
                }else{
                    resolve( data );
                }
            });

        });
    })
};

let send = async function( ){
    await onReady();

    let msg = {
        name: 'dingchaolin',
        sex: 'man',
        time: new Date().toLocaleString()
    };

    setInterval( () => {
        producer.send([{
            topic: topic,
            partition: 0,
            messages: [JSON.stringify(msg)],
            attributes: 0
        }], (err, result) => {
            if( err ){
                console.log("发送失败:", err );
            }else{
                console.log("发送成功:", result );
            }

        });
    }, 1000 );

}

send();
