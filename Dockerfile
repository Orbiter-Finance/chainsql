FROM ubuntu:latest

RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y sqlite3 libsqlite3-dev nodejs npm

RUN mkdir -p /home/www/chainsql
WORKDIR /home/www/chainsql

COPY . /home/www/chainsql
RUN npm i ts-node typescript -g
RUN npm i -g yarn
RUN yarn
RUN npm run build
RUN npm link