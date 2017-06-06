#!/usr/bin/env bash
docker stop $(docker ps -a -q -f ancestor=rabbitmq:3-management)
docker rm $(docker ps -a -q -f ancestor=rabbitmq:3-management)
docker run -d --hostname my-rabbit --name rabbit -p 192.168.1.2:8080:15672 -e RABBITMQ_DEFAULT_USER=bikov -e RABBITMQ_DEFAULT_PASS=blat -e RABBITMQ_NODENAME=rabbit@my-rabbit rabbitmq:3-management