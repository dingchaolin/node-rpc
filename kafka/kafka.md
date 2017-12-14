## kafka mac 安装
- brew install kafka
- brew services start kafka
- brew services stop kafka

## 或者
- zookeeper-server-start /usr/local/etc/kafka/zookeeper.properties 
- kafka-server-start /usr/local/etc/kafka/server.properties

## 注意
- 一定要创建完topic之后，才能进行发送
- 如果topic不存在，消费者会报错