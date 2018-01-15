FROM httpd:2.4-alpine
COPY httpd.conf /usr/local/apache2/conf/httpd.conf
COPY httpd-ssl.conf /usr/local/apache2/conf/extra/httpd-ssl.conf
COPY server.crt /usr/local/apache2/conf/server.crt
COPY server.key /usr/local/apache2/conf/server.key
COPY httpd-foreground /usr/local/bin/httpd-foreground
COPY htdocs /usr/local/apache2/htdocs
EXPOSE 80
EXPOSE 443
