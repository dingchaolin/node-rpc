# kafka centos 集群

## zookeeper最新版本下载地址
- http://mirrors.hust.edu.cn/apache/zookeeper/stable/zookeeper-3.4.10.tar.gz
- wget http://mirrors.hust.edu.cn/apache/zookeeper/stable/zookeeper-3.4.10.tar.gz
- gunzip zookeeper-3.4.10.tar.gz 
- tar -xvf zookeeper-3.4.10.tar.gz
- mv zookeeper-3.4.10 zookeeper

## zookeep安装与配置

### 目录结构

#### bin目录 
- zk的可执行脚本目录，包括zk服务进程，zk客户端，等脚本。其中，.sh是Linux环境下的脚本，.cmd是Windows环境下的脚本。
#### conf目录 
- 配置文件目录。zoo_sample.cfg为样例配置文件，需要修改为自己的名称，一般为zoo.cfg。log4j.properties为日志配置文件。
#### lib 
- zk依赖的包。
#### contrib目录 
- 一些用于操作zk的工具包。
#### recipes目录 
- zk某些用法的代码示例

### 配置文件
- 将示例配置文件重命名 mv zoo_sample.cfg zoo.cfg
- zoo.cfg是官方指定的文件命名规则。

### 配置信息

#### tickTime 
- 时长单位为毫秒，为zk使用的基本时间度量单位。例如，1 * tickTime是客户端与zk服务端的心跳时间，2 * tickTime是客户端会话的超时时间。 
- tickTime的默认值为2000毫秒，更低的tickTime值可以更快地发现超时问题，但也会导致更高的网络流量（心跳消息）和更高的CPU使用率（会话的跟踪处理）。
#### clientPort 
- zk服务进程监听的TCP端口，默认情况下，服务端会监听2181端口。
#### dataDir 
- 无默认配置，必须配置，用于配置存储快照文件的目录。如果没有配置dataLogDir，那么事务日志也会存储在此目录。


### 集群
``` 
在集群模式下，建议至少部署3个zk进程，或者部署奇数个zk进程。
如果只部署2个zk进程，当其中一个zk进程挂掉后，剩下的一个进程并不能构成一个quorum的大多数。
因此，部署2个进程甚至比单机模式更不可靠，因为2个进程其中一个不可用的可能性比一个进程不可用的可能性还大。
``` 
#### 集群配置
```
tickTime=2000
dataDir=/tmp/zookeeper
clientPort=12181
initLimit=5
syncLimit=2
server.1=192.168.64.185:2888:3888
server.2=192.168.64.180:2888:3888

```
#### 含义

##### initLimit 
- ZooKeeper集群模式下包含多个zk进程，其中一个进程为leader，余下的进程为follower。 
- 当follower最初与leader建立连接时，它们之间会传输相当多的数据，尤其是follower的数据落后leader很多。
- initLimit配置follower与leader之间建立连接后进行同步的最长时间。

##### syncLimit 
- 配置follower和leader之间发送消息，请求和应答的最大时间长度。

##### tickTime 
- tickTime则是上述两个超时配置的基本单位，例如对于initLimit，其配置值为5，说明其超时时间为 2000ms * 5 = 10秒。

##### server.id=host:port1:port2 
- 其中id为一个数字，表示zk进程的id，这个id也是dataDir目录下myid文件的内容。 
- host是该zk进程所在的IP地址，port1表示follower和leader交换消息所使用的端口，port2表示选举leader所使用的端口。

#### dataDir 
- 其配置的含义跟单机模式下的含义类似，不同的是集群模式下还有一个myid文件。
- myid文件的内容只有一行，且内容只能为1 - 255之间的数字，这个数字亦即上面介绍server.id中的id，表示zk进程的id。

#### 所有的zookeep集群都要使用相同的配置

### 启动
- cd bin

#### 启动/重启zookeeper Server
- ./zkServer.sh start/restart

#### 查看是否启动成功
- jps
- 显示结果 QuorumPeerMain （这个就是zookeeper进程）表示启动成功了

#### 查看server日志
- ./zkServer.sh start-foreground
- cat zookeeper.out

#### 查看服务状态
- sh ./zkServer.sh status

#### 结束进程
- ./zkServer.sh stop

#### 连接server
- zkCli.sh -server 192.168.64.180:12181,192.168.64.185:12181

#### 启动失败

##### java.net.BindException: 地址已在使用）
- 换个端口，重启一下

##### myid file is missing
- 配置文件中有个配置项 dataDir=/tmp/zookeeper  在这个文件件内创建一个myid的文件，然后编辑写入 id
- id server.1=192.168.64.185:2888:3888 server.2=192.168.64.180:2888:3888  
- 就是这里的 server.1 server.2 中的 1，2 对应一下即可


## kafka最新下载地址
- http://mirror.bit.edu.cn/apache/kafka/1.0.0/kafka_2.11-1.0.0.tgz
- wget http://mirror.bit.edu.cn/apache/kafka/1.0.0/kafka_2.11-1.0.0.tgz
- tar -zxvf kafka_2.11-1.0.0.tgz 
- mv kafka_2.11-1.0.0.tgz kafka


### 修改配置文件
- cd config
- 主要是这个 server.properties
- 各个配置参数意义

```
broker.id=0  #当前机器在集群中的唯一标识，和zookeeper的myid性质一样
port=19092 #当前kafka对外提供服务的端口默认是9092
host.name=192.168.64.185 #这个参数默认是关闭的，在0.8.1有个bug，DNS解析问题，失败率的问题。
num.network.threads=3 #这个是borker进行网络处理的线程数
num.io.threads=8 #这个是borker进行I/O处理的线程数
log.dirs=/opt/kafka/kafkalogs/ #消息存放的目录，这个目录可以配置为“，”逗号分割的表达式，上面的num.io.threads要大于这个目录的个数这个目录，如果配置多个目录，新创建的topic他把消息持久化的地方是，当前以逗号分割的目录中，那个分区数最少就放那一个
socket.send.buffer.bytes=102400 #发送缓冲区buffer大小，数据不是一下子就发送的，先回存储到缓冲区了到达一定的大小后在发送，能提高性能
socket.receive.buffer.bytes=102400 #kafka接收缓冲区大小，当数据到达一定大小后在序列化到磁盘
socket.request.max.bytes=104857600 #这个参数是向kafka请求消息或者向kafka发送消息的请请求的最大数，这个值不能超过java的堆栈大小
num.partitions=1 #默认的分区数，一个topic默认1个分区数
log.retention.hours=168 #默认消息的最大持久化时间，168小时，7天
message.max.byte=5242880  #消息保存的最大值5M
default.replication.factor=2  #kafka保存消息的副本数，如果一个副本失效了，另一个还可以继续提供服务
replica.fetch.max.bytes=5242880  #取消息的最大直接数
log.segment.bytes=1073741824 #这个参数是：因为kafka的消息是以追加的形式落地到文件，当超过这个值的时候，kafka会新起一个文件
log.retention.check.interval.ms=300000 #每隔300000毫秒去检查上面配置的log失效时间（log.retention.hours=168 ），到目录查看是否有过期的消息如果有，删除
log.cleaner.enable=false #是否启用log压缩，一般不用启用，启用的话可以提高性能
zookeeper.connect=192.168.64.180:12181,192.168.64.185:12181 #设置zookeeper的连接端口
```

- 实际应用的时候做如下修改
### hostname
- host.name=192.168.64.180

### 在log.retention.hours=168 下面新增下面三项

#### message.max.byte=5242880
- broker能接收消息的最大字节数，这个值应该比消费端的fetch.message.max.bytes更小才对，否则broker就会因为消费端无法使用这个消息而挂起。

#### default.replication.factor=2
- 在几个broker中保存

#### replica.fetch.max.bytes=5242880


### 启动
- cd bin
- sh kafka-server-start.sh ../config/server.properties

### 后台启动
- ./kafka-server-start.sh ../config/server.properties 1>/dev/null 2>&1 &

### 检查是否启动成功
- jps
- 显示有 kafka 的进程 表示启动成功

### 查看topics 列表
- ./kafka-topics.sh --list --zookeeper 192.168.64.180:12181
- ./kafka-topics.sh --list --zookeeper 192.168.64.185:12181

### 查看topic 详情
- ./kafka-topics.sh -zookeeper 192.168.64.185:12181 -describe -topic topicName


## kafka 管理系统
### 下载
- git clone https://github.com/yahoo/kafka-manager.git

#### 安装 sbt
- mac下  brew install sbt
- centos下
- http://www.scala-sbt.org/download.html 下载 解压 安装
- 查看是否安装成功 sbt sbt-version 会更新东西，时间有点久

#### 编译打包
- cd kafka-manager
- sbt clean dist
- 生成的包在 kafka-manager/target/universal 下面。生成的包只需要java环境就可以运行了
- 解压
- 修改conf/application.conf，把kafka-manager.zkhosts改为自己的zookeeper服务器地址
- kafka-manager.zkhosts="127.0.0.1:2181"
- 进入bin目录启动 
- ./kafka-manager -Dconfig.file=../conf/application.conf
- 后台启动
-nohup ./kafka-manager -Dconfig.file=../conf/application.conf >/dev/null 2>&1 & 
- 默认http端口是9000，可以修改配置文件里的http.port的值，或者通过命令行参数传递：
- ./kafka-manager -Dhttp.port=9001













