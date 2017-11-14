import {mq} from "./client";
let count = 0;
import {config} from "./config";
let exchangeName = config.exchangeName;
let test = async function(){
    await mq.init();

    setInterval(async () => {
        ++count;
        console.log(`进程 A 第${count}次发消息~`);
        await mq.publish( exchangeName, `A--------第${count}次，你好啊！`);
        }, 1000);

}

test();