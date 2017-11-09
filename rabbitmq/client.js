"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const MQ = require("amqplib");
const config_1 = require("./config");
const rabbitmq_url = config_1.config.development;
class RabbitClient {
    constructor(url) {
        this.url = url;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection = yield MQ.connect(this.url);
            this.channel = yield this.connection.createChannel();
        });
    }
    send(queueName, message) {
        return this.channel.sendToQueue(queueName, new Buffer(JSON.stringify(message)));
    }
    ;
    publish(exchangeName, message) {
        return this.channel.publish(exchangeName, '', new Buffer(JSON.stringify(message)));
    }
    ;
    subscribe(exchangeName, pro_func) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.channel.assertExchange(exchangeName, 'fanout', { durable: false });
            let qok = yield this.channel.assertQueue('', { exclusive: true });
            yield this.channel.bindQueue(qok.queue, exchangeName, '');
            yield this.channel.consume(qok.queue, (msg) => {
                pro_func(JSON.parse(msg.content.toString()));
            }, { noAck: true });
        });
    }
    ;
    receive(queueName, prefetchCount, pro_func) {
        return __awaiter(this, void 0, void 0, function* () {
            let ok = yield this.channel.assertQueue(queueName, { durable: true });
            yield this.channel.prefetch(prefetchCount);
            this.channel.consume(queueName, (msg) => {
                pro_func(JSON.parse(msg.content.toString())).then(() => {
                    this.channel.ack(msg);
                }, (err) => {
                    this.channel.nack(msg, true, true);
                    console.error("错误信息====>", err);
                });
            }, { noAck: false });
        });
    }
}
exports.mq = new RabbitClient(rabbitmq_url);
