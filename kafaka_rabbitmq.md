## kafaka-rabbitmq 比较

### 1.消息确认
- rabbitmq 有
- kafaka 无

### 2. 吞吐量
- kafka zero-copy机制，具有O(1)的复杂度，消息处理效率很高，相同条件下，吞吐量可能是rabbitmq的3倍左右。
- rabbitmq 吞吐量不如kafka， 但是rabbitmq支持可靠传输，支持事务，不支持批量操作。
- rabbitmq在不使用ACK机制的，Msg大小为1K的情况下，QPS可达6W＋。再双方ACK机制，Msg大小为1K的情况下，QPS瞬间降到了1W＋。从某种意义上RabbitMQ还真是慢。


### 3. 可用性
- rabbitMQ支持miror的queue，主queue失效，miror queue接管。
- kafka的broker支持主从模式。

### 4. 关于消息顺序
- Kafka对消息的重复、丢失、错误以及顺序型没有严格的要求。但是part只会被consumer group内的一个consumer消费，故kafka保证每个parti内的消息会被顺序的消费。


### 5. 怎么用

#### RabbitMQ该怎么用
- RabbitMQ的消息应当尽可能的小，并且只用来处理实时且要高可靠性的消息。
- 消费者和生产者的能力尽量对等，否则消息堆积会严重影响RabbitMQ的性能。
- 集群部署，使用热备，保证消息的可靠性。

#### Kafka该怎么用
- 应当有一个非常好的运维监控系统，不单单要监控Kafka本身，还要监控Zookeeper。
- 对消息顺序不依赖，且不是那么实时的系统。
- 对消息丢失并不那么敏感的系统。