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
const client_1 = require("./client");
let count = 0;
let test = function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield client_1.mq.init();
        yield client_1.mq.receive("dcl_1", 100, (msg) => {
            console.log(`进程 F 收到消息内容为:==>${msg}`);
            return new Promise((resolve, reject) => {
                if (msg) {
                    resolve(msg);
                }
                else {
                    reject({ error: 1, msg: "未收到" });
                }
            });
        });
    });
};
test();
