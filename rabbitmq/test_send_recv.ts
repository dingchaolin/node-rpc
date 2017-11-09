import {mq} from "./client";
let count = 0;

let test = async function(){
    await mq.init();
    await mq.receive("dcl_1", 100,( msg )=>{
        console.log(`收到消息内容为:==>${msg}`)
        return new Promise( (resolve, reject) => {
            if( msg ){
                resolve( msg );
            }else{
                reject({error:1,msg:"未收到"})
            }
        });
    })

    setInterval(() => {
        mq.send( "dcl_1", `第${++count}次，你好啊！`);
        }, 500);

}

test();