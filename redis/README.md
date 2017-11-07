## ioredis
- npm install ioredis --save
- 先启动订阅者 再启动发布者  
- 如果先启动发布者，发布者在发布的时候，如果订阅者没有起，第一次发布的消息是收不到的
