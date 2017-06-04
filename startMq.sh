docker stop $(docker ps -a -q -f ancestor=rabbitmq:3-management)
docker rm $(docker ps -a -q -f ancestor=rabbitmq:3-management)
docker run -d --hostname my-rabbit --name some-rabbit -p 5671:5671 -p 5672:5672 -p 4369:4369 -p 15671:15671 -p 8080:15672 -p 25672:25672 -e RABBITMQ_DEFAULT_USER=bikov -e RABBITMQ_DEFAULT_PASS=blat -e RABBITMQ_NODENAME=rabbit@my-rabbit rabbitmq:3-management