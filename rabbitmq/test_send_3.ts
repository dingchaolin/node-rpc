import {mq} from "./client";
let count = 0;

let test = async function(){
    await mq.init();
    setInterval(() => {
        ++count;
        console.log(`进程 C 第${count}次发出消息~!`)
        mq.send( "dcl_1", `C---------第${count}次，你好啊！`);
        }, 1000);

}

test();