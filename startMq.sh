docker stop $(docker ps -a -q -f ancestor=rabbitmq:3-management)
docker rm $(docker ps -a -q -f ancestor=rabbitmq:3-management)
docker run -d --hostname my-rabbit --name some-rabbit -p 9999:15672 -e RABBITMQ_DEFAULT_USER=bikov -e RABBITMQ_DEFAULT_PASS=blat rabbitmq:3-management