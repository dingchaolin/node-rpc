import {mq} from "./client";
let count = 0;

let test = async function(){
    await mq.init();
    setInterval(() => {
        ++count;
        console.log(`进程 A 第${count}次发出消息~!`)
        mq.send( "dcl_1", `A------第${count}次，你好啊！`);
        }, 1000);

}

test();