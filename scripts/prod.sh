#!/bin/bash

trap 'kill $(jobs -p)' EXIT

set -e
set -x

npm run build-server &
npm run build-client &

cp -r ./src/client/static ./dist/client/static & 
cp -r ./src/client/index.html ./dist/client/index.html & 

sudo cp -r /home/ec2-user/clack/dist/client /var/www/clack &

npm run run-server &
sudo systemctl reload nginx

wait
