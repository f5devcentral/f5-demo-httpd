FROM httpd:2.4-alpine
COPY httpd.conf /usr/local/apache2/conf/httpd.conf
COPY httpd-ssl.conf /usr/local/apache2/conf/extra/httpd-ssl.conf
COPY server.crt /usr/local/apache2/conf/server.crt
COPY server.key /usr/local/apache2/conf/server.key
COPY htdocs/httpd-foreground /usr/local/bin/httpd-foreground
COPY htdocs /usr/local/apache2/htdocs
RUN chown -R 1001:1001 /usr/local/apache2/logs/
RUN chmod 777 /usr/local/apache2/logs/
EXPOSE 8080
EXPOSE 8443
USER 1001
