FROM nginx:1.27

COPY . /var/www/html/blitzpong
COPY ./conf/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./conf/certs /etc/nginx/certs

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]