FROM 12.2.0-alpine

WORKDIR /pharos.net

COPY package.json /pharos.net/package.json
RUN npm config set registry http://registry.npm.qiwoo.org && \
  npm config set package-lock false && npm install

COPY . /pharos.net
RUN rm -rf view

ENV DOCKER=true
EXPOSE 9000
ENTRYPOINT [ "npm", "start" ]