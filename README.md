# dockerMqTest
## Build
To build the app, you have to start docker deamon localy and do: ```js npm run build ``` from root directory.
It will create 2 docker images and save them local on docker deamon.

## Start
###To run the stack on dockers:
You have to run ```shell docker-compose up```
Now you can access to http://localhost:8080 to see RabbitMq managment web site.

###To run from idea
You have to run:```shell docker run --name some-redis -p 6379:6379 -d redis```to start redis.
and ```shell docker run -d --hostname my-rabbit --name some-rabbit -p 5671:5671 -p 5672:5672 -p 4369:4369 -p 15671:15671 -p 8080:15672 -p 25672:25672 -e RABBITMQ_DEFAULT_USER=bikov -e RABBITMQ_DEFAULT_PASS=blat -e RABBITMQ_NODENAME=rabbit@my-rabbit rabbitmq:3-management``` to start rabbit mq localy