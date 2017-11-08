# rabbitmq

### mac 安装
- brew update
- brew install rabbitmq

### 启动
- brew services start rabbitmq

### 访问管理后台
    - http://localhost:15672
- 账号/密码  guest/guest

# RabbitMQ 四种exchange模式解析
- fanout,direct,topic,header
- header模式在实际使用中较少，只对前三种模式进行比较。
- 性能排序：fanout > direct >> topic。比例大约为11：10：6

### Direct Exchange
- 1.一般情况可以使用rabbitMQ自带的Exchange：该Exchange的名字为空字符串，default Exchange
- 2.这种模式下不需要将Exchange进行任何绑定(binding)操作
- 3.消息传递时需要一个“RouteKey”，可以简单的理解为要发送到的队列名字。
- 4.如果不存在RouteKey中指定的队列名，则该消息会被抛弃。

### Fanout Exchange 
- 任何发送到Fanout Exchange的消息都会被转发到与该Exchange绑定(Binding)的所有Queue上。
- 1.可以理解为路由表的模式
- 2.这种模式不需要RouteKey
- 3.这种模式需要提前将Exchange与Queue进行绑定，一个Exchange可以绑定多个Queue，一个Queue可以同多个Exchange进行绑定。
- 4.如果接受到消息的Exchange没有与任何Queue绑定，则消息会被抛弃。

### Topic Exchange
- 任何发送到Topic Exchange的消息都会被转发到所有关心RouteKey中指定话题的Queue上
- 1.这种模式较为复杂，简单来说，就是每个队列都有其关心的主题，所有的消息都带有一个“标题”(RouteKey)，Exchange会将消息转发到所有关注主题能与RouteKey模糊匹配的队列。
- 2.这种模式需要RouteKey，也许要提前绑定Exchange与Queue。
- 3.在进行绑定时，要提供一个该队列关心的主题，如“#.log.#”表示该队列关心所有涉及log的消息(一个RouteKey为”MQ.log.error”的消息会被转发到该队列)。
- 4.“#”表示0个或若干个关键字，“*”表示一个关键字。如“log.*”能与“log.warn”匹配，无法与“log.warn.timeout”匹配；但是“log.#”能与上述两者匹配。
- 5.同样，如果Exchange没有发现能够与RouteKey匹配的Queue，则会抛弃此消息。

# amqplib API 相关

### 1. connect
- frameMax 每次传输最大字节数 0 表示没有限制  不要超过buffer的最大限制
- channelMax  最大通道数量  2^16 - 1
- heartbeat 心跳时长  0 表示没有  如果客户端有2次没有读到心跳数据，将会抛出一个错误 并且 断开连接
- locale 错误信息的展示语言 en_US 默认值

### 2. createChannel
- 当达到最大的通道数量的时候，就会创建失败

### 3. assertQueue
- 推断一个队列是不是存在
- queue 队列名 string  如果不填或者填一个false的值 服务器会给你一个随机的值
- options.exclusive: if true, scopes the queue to the connection (defaults to false)
- options.autoDelete  当队列的用户为0时 该队列会被删除
- options.durable if true, the queue will survive broker restarts

### 4. checkQueue
- 检查队列是否存在

### 5. deleteQueue
- 删除队列,

### 6. purgeQueue
- 移除队列中所有没有传输的消息

### 7. bindQueue
- 将一个通道路径跟一个队列绑定

### 8. unbindQueue

### 9.assertExchange
- 推断一个通道是否存在:将通道变为实例
- fanout 是把拿到消息推到与之绑定的所有queue中, 多播
- direct 直连类型的交换机，通过routingkey来决定把消息推到哪个queue中
- topic 消息都会被转发到所有关心routingkey中指定话题的queue上
### 10. checkExchange

### 11. deleteExchange

### 12. bindExchange 
- bindExchange(destination, source, pattern, [args, [function(err, ok) {...}]])
- destination通道中将能收到source通道中的消息

### 13. unbindExchange

### 14. publish
- 向一个通道广播信息
- publish(exchange, routingKey, content, [options])
- exchange 通道名 如果不存在 通道将会关闭
- routingKey 队列名
- content 内容
- exchange 和 routingKey 决定了消息的去处
- 当exchange为''的时候，消息将发送到routingKey,此种情况等价于#sendToQueue

### 15. sendToQueue
- 向某个队列发送一条消息

### 16. consume
- 为每个接受到publish的消息指定一个回调函数，在回调函数中可以处理publish的消息内容
- options.noAck 
- 默认 false 当为false是表示消息出队后不会自动删除，如果设置成true,则无论消息处理成功与否此消息会被删除。注意到在消息不成功是，调用了ch.nack(msg))，此方法是将消息重新入队。
- options.consumerTag 服务器用来区分消费者传递消息的名称 通常是一个随机的名字
- 服务器的回复中fields中有consumerTag，在取消cancel中

### 17. cancel
- 服务器停止向consumerTag指定的消费者发送消息

### 18. get
- 从一个队列中获取一条消息
- 当队列中数据为空 promise会resolve(false)
- options.noAck 同consume中的相关内容

### 19. ack
- 确认收到消息
- consume or #get is issued with noAck: false 
- 当消息不需要确认或者消息被重复确认将会出现错误，此时可以使用 ackAll

### 20. ackAll
- 当队列中没有某条消息的时候，这是一个安全的操作

### 21. nack
- 某条消息没有收到，该条消息将会重新进入队列

### 22. nackAll
- 此操作会导致所有已发送的消息重新进入队列

### 23. reject
- 等价于 nack
- < v2.3.0 可以使用

### 24. prefetch
- 设置预取消息的数量

### 25. recover
- 将没有确认收到的消息重新放回队列

## ConfirmChannel
- 每条消息都要确认回复收到或者没有收到

## 26. createConfirmChannel
- 创建将Confirm通道

## 27. 发送
- sendToQueue
- publish

## 28. waitForConfirms
- 当所有publish的消息被确认后，才会有返回结果
- 如果任何一条消息被确认没有收到，将会返回错误
- 通道可以重复使用
- 可以调用多次在全部确认完成之前









