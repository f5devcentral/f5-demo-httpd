FROM httpd:2.4-alpine
COPY htdocs/httpd.conf /usr/local/apache2/conf/httpd.conf
COPY htdocs/httpd-foreground /usr/local/bin/httpd-foreground
COPY htdocs /usr/local/apache2/htdocs
