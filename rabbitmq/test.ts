import {mq} from "./client";
let count = 0;

let test = async function(){
    await mq.init();
    await mq.subscribe("dcl", ( msg )=>{
        console.log(`收到消息内容为:==>${msg}`)
    })

    setInterval(async () => {
        await mq.publish( "dcl", `第${++count}次，你好啊！`);
        }, 1000);

}

test();