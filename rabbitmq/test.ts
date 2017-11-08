import {mq} from "./client";


let test = async function(){
    await mq.init();
    await mq.subscribe("dcl", ( msg )=>{
        console.log(`收到消息内容为:==>${msg}`)
    })

    await mq.publish( "dcl", "你好啊！");
}

test();