import {mq} from "./client";
let count = 0;
import {config} from "./config";
let exchangeName = config.exchangeName;
let test = async function(){
    await mq.init();
    await mq.subscribe(exchangeName, ( msg )=>{
        console.log(`进程F---------收到消息内容为:==>${msg}`)
        return new Promise((resolve, reject) => {
            if (msg) {
                resolve(msg);
            } else {
                reject({error: 1, msg: "未收到"})
            }
        });
    })


}

test();