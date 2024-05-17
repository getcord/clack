#!/bin/bash

set -e
set -x

npm run build-server
npm run build-client

cp -r ./src/client/static ./dist/client
cp ./src/client/index.html ./dist/client/index.html

sudo cp -r /home/ec2-user/clack/dist/client /var/www/clack

sudo systemctl reload nginx
npm run run-server
