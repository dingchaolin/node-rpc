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
        /*
        fanout 多播类型 routingKey可以不指定, 指定也没用
        direct 直连类型  通过routingkey来决定把消息推到哪个queue中 不需要绑定队列
        topic  通过routingkey来决定把消息推到哪个queue中 需要绑定队列
         */
        return this.channel.publish(exchangeName, '', new Buffer(JSON.stringify(message)))
    };

    /*
    订阅消息
     */
    async subscribe(exchangeName, pro_func){
        await this.channel.assertExchange(exchangeName, 'fanout', {durable: false});
        let qok = await this.channel.assertQueue('',{exclusive:true});
        await this.channel.bindQueue(qok.queue, exchangeName, '');
        await this.channel.consume(qok.queue, ( msg: any ) => {
            pro_func( JSON.parse(msg.content.toString()));
        },{noAck:true})
    };


    /*
    接收消息
     */
    async receive(queueName, prefetch, pro_func){
        let ok = await this.channel.assertQueue(queueName,{durable:true});
        await this.channel.prefetch(prefetch);
        this.channel.consume(queueName, function (msg:any) {
            pro_func(JSON.parse(msg.content.toString())).then(
                function onFulfilled(){
                    this.channel.ack(msg);
                },
                function onRejected(err){
                    this.channel.nack(msg,false,false);
                    console.error(err.stack)
                }
            )
        },{noAck:false});

    }
}

export let mq = new RabbitClient(rabbitmq_url);