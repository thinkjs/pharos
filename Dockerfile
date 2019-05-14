FROM r.addops.soft.360.cn/library/nodejs-8-el7:latest

WORKDIR /pharos.net

COPY package.json /pharos.net/package.json
RUN npm config set registry http://registry.npm.qiwoo.org && \
  npm config set package-lock false && npm install

COPY . /pharos.net
RUN rm -rf view && \
  cp -r output/* ./ && \
  rm -rf output

ENV DOCKER=true
EXPOSE 9000
ENTRYPOINT [ "npm", "start" ]