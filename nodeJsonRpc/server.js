const rpc = require('node-json-rpc');
const PORT = 5080;
const options = {
    port: PORT, //默认端口 http 5080  https 5433
    host: '127.0.0.1',
    path: '/',//默认路径
    strict: true
};

// 创建rpc server
let serv = new rpc.Server(options);

// 添加云方法
serv.addMethod('add', function (para, callback) {
    let error, result;
    if (para.length === 2) {
        result = para[0] + para[1];
    } else if (para.length > 2) {
        result = 0;
        para.forEach(function (v, i) {
            result += v;
        });
    } else {
        error = { code: -32602, message: "Invalid params" };
    }

    callback(error, result);
});

// 启动server
serv.start(function (error) {
    if (error) throw error;
    else console.log(`Server running on port ${PORT} !`);
});