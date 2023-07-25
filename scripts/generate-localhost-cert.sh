#!/bin/bash

brew install mkcert
mkcert -install

SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
mkcert \
  -cert-file $SCRIPTPATH/../dist/localhost/localhost.crt \
  -key-file $SCRIPTPATH/../dist/localhost/localhost.key \
  localhost 127.0.0.1 ::1 0.0.0.0