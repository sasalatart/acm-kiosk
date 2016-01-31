FROM node:5-onbuild

MAINTAINER Sebastian Salata R-T <SA.SalataRT@GMail.com>

RUN npm install -g bower
RUN bower install --allow-root

EXPOSE 8888
