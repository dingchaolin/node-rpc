/**
 * Created by dcl on 2017/11/08.
 */
import * as MQ from "amqplib";
import {config} from "./config";
import {Connection, Channel} from "amqplib";
const rabbitmq_url = config.development;

class RabbitClient {
    private url: string;
    private connection: Connection;
    private channel: Channel;
    constructor( url:string ){
        this.url = url;
    }

    /*
    初始化连接和通道
     */
    async init(){
        this.connection = await MQ.connect(this.url);
        this.channel = await this.connection.createChannel();
    }


    /*
    向某一通道发送信息
     */
    send(queueName: string, message: any): boolean {
        return this.channel.sendToQueue(queueName, new Buffer(JSON.stringify(message)));
    };

    /*
    发布信息
     */
    publish(exchangeName: string, message: any): boolean{

        return this.channel.publish(exchangeName, '', new Buffer(JSON.stringify(message)))
    };

    /*
    订阅消息
    publish的消息会在pro_func这个回调函数中收到
     */
    async subscribe(exchangeName, pro_func){
        /*
        fanout 多播类型 routingKey可以不指定, 指定也没用
        direct 直连类型  通过routingkey来决定把消息推到哪个queue中 不需要绑定队列
        topic  通过routingkey来决定把消息推到哪个queue中 需要绑定队列
        header 不常用
         */
        // 设置通道类型 durable true 如果重启，这个通道依然存在
        await this.channel.assertExchange(exchangeName, 'fanout', {durable: false});
        //队列名随机  根连接关联
        let qok = await this.channel.assertQueue('',{exclusive:true});
        //绑定队列-通道
        await this.channel.bindQueue(qok.queue, exchangeName, '');
        //消费通道消息
        //noAck true 队列中的消息发出之后，立即删除，不管是否收到
        await this.channel.consume(qok.queue, ( msg: any ) => {
            pro_func( JSON.parse(msg.content.toString()));
        },{noAck:true})
    };


    /*
    接收消息
     */
    async receive(queueName, prefetchCount, pro_func){
        //确认队列, durable 如果重启 队列依然存在
        let ok = await this.channel.assertQueue(queueName,{durable:true});
        //从队列取数据 prefetchCount 数量
        await this.channel.prefetch(prefetchCount);
        //消费队列消息
        //noAck false 如果消息被nack 消息会重新进入队列
        this.channel.consume(queueName, (msg:any) => {
            pro_func(JSON.parse(msg.content.toString())).then(
                () => {
                    //成功
                    this.channel.ack(msg);
                },
                (err)=>{
                    //失败
                    /*
                    nack(message, [allUpTo, [requeue]])
                    allUpTo true 出错的消息优先处理
                    requeue 把出错的消息放到原来的队列中
                     */
                    this.channel.nack(msg,true,true);
                    console.error("错误信息====>",err)
                }
            )
        },{noAck:false});

    }
}

export let mq = new RabbitClient(rabbitmq_url);