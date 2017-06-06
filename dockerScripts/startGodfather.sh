#!/usr/bin/env bash
docker stop $(docker ps -a -q -f ancestor=bikov/godfather)
docker rm $(docker ps -a -q -f ancestor=bikov/godfather)
docker run --name godfather --link rabbit:mq bikov/godfather