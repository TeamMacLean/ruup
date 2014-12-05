FROM ubuntu
MAINTAINER Martin Page

RUN apt-get -y update

RUN apt-get install -y build-essential

RUN apt-get install -y python-software-properties software-properties-common python python-setuptools
RUN add-apt-repository ppa:chris-lea/node.js
RUN echo "deb http://us.archive.ubuntu.com/ubuntu/ precise universe" >> /etc/apt/sources.list
RUN apt-get update
RUN apt-get install -y nodejs

RUN apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
RUN echo "deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen" | tee -a /etc/apt/sources.list.d/10gen.list
RUN apt-get -y update
RUN apt-get -y install mongodb-10gen

ADD . /var/www

RUN cd /var/www ; npm install ; bower install