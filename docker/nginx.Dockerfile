FROM nginx

WORKDIR /opt/app

RUN ln -fs /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
  && dpkg-reconfigure -f noninteractive tzdata

# USER root
COPY ./nginx/logs /opt/app/logs
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf