#!/usr/bin/env bash
docker stop $(docker ps -a -q -f ancestor=bikov/rasp)
docker rm $(docker ps -a -q -f ancestor=bikov/rasp)
docker run --name rasp --link rabbit:mq bikov/rasp