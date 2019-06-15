FROM nginx

WORKDIR /opt/app

# USER root
COPY ./nginx/logs /opt/app/logs
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf