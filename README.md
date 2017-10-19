F5 Demo - Apache HTTPD
======================

### About

Simple Docker Apache HTTPD container.

This is [F5 Contributed Software](https://support.f5.com/csp/article/K80012344)

[Docker Hub](https://hub.docker.com/r/f5devcentral/f5-demo-httpd/)

### Requirements
   Docker 

### Usage

```
# simple page
docker run -p 8080:80
# simple website
docker run --rm -e F5DEMO_APP=website f5devcentral/f5-demo-httpd
# simple frontend
docker run --rm -e F5DEMO_APP=frontend -e F5DEMO_BACKEND_URL=http://10.1.20.10/backend.shtml f5devcentral/f5-demo-httpd
# simple backend
docker run --rm -e F5DEMO_APP=backend f5devcentral/f5-demo-httpd
```

Other variables for "website"

```
# change the title
-e F5DEMO_NODENAME='Your Website'
# change the color
-e F5DEMO_COLOR=656263
-e F5DEMO_COLOR=ffd734
-e F5DEMO_COLOR=0194d2
-e F5DEMO_COLOR=a0bf37
-e F5DEMO_COLOR=ed7b0c
-e F5DEMO_COLOR=004892
```

### Authored By

[Eric Chen](https://devcentral.f5.com/users/123940) | [@chen23](https://github.com/chen23)
