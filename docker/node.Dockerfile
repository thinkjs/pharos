FROM node:12.2.0-alpine

WORKDIR /opt/app

RUN apk add tzdata && \
  cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
  echo "Asia/Shanghai" > /etc/timezone && \
  apk del tzdata

COPY package.json /opt/app/package.json
RUN npm config set registry http://registry.npm.qiwoo.org && \
  npm config set package-lock false && npm install

COPY . /opt/app

RUN cd www && npm config set registry http://registry.npm.qiwoo.org && \
  npm config set package-lock false && npm install && npm run build:production && cd static && chmod -R 777 bundle.js


ENV DOCKER=true
EXPOSE 8360
ENTRYPOINT [ "node", "production.js" ]