#!/usr/bin/env bash
set -e

echo "\$@ -> $@"

if [ "$1" = 'nginx' ]
then
  if [ ! -f /etc/nginx/dhparam.pem ]
  then
    echo "/etc/nginx/dhparam.pem not found, generating..."
    openssl dhparam -dsaparam -out /etc/nginx/dhparam.pem 2048 > /dev/null 2>&1
  fi

  if [ ! -f /etc/nginx/server.crt ] && [ ! -f /etc/nginx/server.key ]
  then
    echo "/etc/nginx/server.crt+server.key not found, generating self-signed cert+key"
    echo -e "[req]\ndistinguished_name=dn\n[dn]\n[ext]\n"\
             "basicConstraints=critical,CA:FALSE\n"\
             "keyUsage=critical,digitalSignature,keyEncipherment\n"\
             "subjectAltName=DNS:example.com,DNS:www.example.com\n"\
             "extendedKeyUsage=critical,serverAuth,clientAuth\n" > /tmp/openssl.conf

    openssl req -x509 -newkey rsa:2048 -nodes -sha256 -batch \
            -days 1825 -config /tmp/openssl.conf -extensions ext \
            -keyout /etc/nginx/server.key -out /etc/nginx/server.crt \
            -subj "/C=AQ/O=Example Corp./CN=www.example.com" > /dev/null 2>&1
    rm /tmp/openssl.conf
  fi

  if [ ! -f /etc/nginx/chain.crt ]
  then
    echo "/etc/nginx/chain.crt not found, linking to /etc/nginx/server.crt"
    ln -s /etc/nginx/server.crt /etc/nginx/chain.crt
  fi

  if [ ! -f /etc/nginx/conf.d/f5demo.conf ]
  then
    COLORS=(656263 ffd734 0194d2 a0bf37 ed7b0c 004892)

    # randomize colors
    if [ "$F5DEMO_COLOR" = "__RANDOMIZE" ]
    then
      COLORS=(656263 ffd734 0194d2 a0bf37 ed7b0c 004892)
      export F5DEMO_COLOR=${COLORS[$(( $RANDOM % 6 ))]}
    fi
    if [ "$F5DEMO_COLOR_SSL" = "__RANDOMIZE" ]
    then
      F5DEMO_COLOR_SSL=$F5DEMO_COLOR
      # avoid same color for ssl
      while [ "$F5DEMO_COLOR_SSL" = "$F5DEMO_COLOR" ]
      do
        export F5DEMO_COLOR_SSL=${COLORS[$(( $RANDOM % 6 ))]}
      done
    fi

    # set nodename to hostname
    if [ "$F5DEMO_SHORT_NODENAME" = "__HOSTNAME" ]
    then
      export F5DEMO_SHORT_NODENAME=$HOSTNAME
    fi
    export NAMESERVER=`cat /etc/resolv.conf | grep "nameserver" | awk '{print $2}' | tr '\n' ' '`
    # build nginx config from template
    envsubst '$F5DEMO_NODENAME $F5DEMO_NODENAME_SSL $F5DEMO_COLOR $F5DEMO_COLOR_SSL $F5DEMO_BACKEND_URL $F5DEMO_APP $NAMESERVER' < /etc/nginx/conf.d/f5demo.template > /etc/nginx/conf.d/f5demo.conf
  fi


  shift 1
  exec nginx "$@"
fi

exec "$@"
