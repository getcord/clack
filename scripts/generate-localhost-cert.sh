#!/bin/bash

brew install mkcert
mkcert -install

SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
CERTPATH="$SCRIPTPATH/../dist/localhost"
mkdir -p  "$CERTPATH"
mkcert \
  -cert-file "$CERTPATH"/localhost.crt \
  -key-file "$CERTPATH"/localhost.key \
  localhost 127.0.0.1 ::1 0.0.0.0
