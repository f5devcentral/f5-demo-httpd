F5 Demo - NGINX Backend
=======================

### About

Simple Docker NGINX backend container.  This was formerly based on Apache HTTPD, but updated to use NGINX. 

This can be used for simple demos.

The Apache HTTPD configuration is left as reference.

This is [F5 Contributed Software](https://support.f5.com/csp/article/K80012344)

[Docker Hub](https://hub.docker.com/r/f5devcentral/f5-demo-httpd/)

### Requirements
   Docker 

### Usage

```
# simple page
docker run -p 8080:80 f5devcentral/f5-demo-httpd:nginx
# simple website
docker run --rm -e F5DEMO_APP=website f5devcentral/f5-demo-httpd:nginx
# simple frontend
docker run --rm -e F5DEMO_APP=frontend -e F5DEMO_BACKEND_URL=http://10.1.20.10/backend.shtml f5devcentral/f5-demo-httpd:nginx
# simple frontend with backend url using proxy host header
docker run --rm -e F5DEMO_APP=frontend -e F5DEMO_BACKEND_URL=http://10.10.10.10/backend.shtml -e F5DEMO_BACKEND_HOST=backend.corp f5devcentral/f5-demo-httpd:nginx
# simple backend
docker run --rm -e F5DEMO_APP=backend f5devcentral/f5-demo-httpd:nginx
# different name/color for non-ssl/ssl
docker run --rm -p 8080:80 -p 8443:443 \
                -e F5DEMO_APP=website \
                -e F5DEMO_NODENAME='No SSL' \
                -e F5DEMO_COLOR=ffd734 \
                -e F5DEMO_NODENAME_SSL='SSL Site' \
                -e F5DEMO_COLOR_SSL=a0bf37 \
                f5devcentral/f5-demo-httpd:nginx

# compatible with openshift (does not run as root)
docker run --rm -p 8080:8080 -p 8443:8443 -e F5DEMO_APP=website f5devcentral/f5-demo-httpd:openshift
```

Other variables for "website"

```
# change the title
-e F5DEMO_NODENAME='Your Website'
# change the color

# dark gray
-e F5DEMO_COLOR=656263
# yellow
-e F5DEMO_COLOR=ffd734
# blue
-e F5DEMO_COLOR=0194d2
# green
-e F5DEMO_COLOR=a0bf37
# orange
-e F5DEMO_COLOR=ed7b0c
# dark blue
-e F5DEMO_COLOR=004892
```

### URIs

```
/index.shtml: simple site
/frontend.shtml: simple frontend (for reverse-proxy demo)
/backend.shtml: simple backend
/backend/: proxy request to backend server
/website.shtml: Simple website
/headers/: Output of Client/Server HTTP headers
/headers.json: Output of client headers in JSON
/txt: NJS output of NGINX variables

================================================
 ___ ___   ___                    _
| __| __| |   \ ___ _ __  ___    /_\  _ __ _ __
| _||__ \ | |) / -_) '  \/ _ \  / _ \| '_ \ '_ \
|_| |___/ |___/\___|_|_|_\___/ /_/ \_\ .__/ .__/
                                      |_|  |_|
================================================

      Node Name: F5 Docker vLab
     Short Name: 41fd19e86e9a

      Server IP: 172.17.0.2
    Server Port: 80

      Client IP: 172.17.0.1
    Client Port: 45664

Client Protocol: HTTP
 Request Method: GET
    Request URI: /txt

    host_header: localhost
     user-agent: curl/7.29.0
x-forwarded-for: 192.168.1.187


```

### Authored By

[Eric Chen](https://devcentral.f5.com/s/profile/0051T000008tz2AQAQ) | [@chen23](https://github.com/chen23)
