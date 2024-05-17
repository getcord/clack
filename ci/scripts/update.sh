#!/bin/bash

# This is similar to ./scripts/prod
# It also git pulls and installs, and assumes the server is running
# in a tmux session called clack, and restarts it there

echo "Running update script!"

set -e
set -x

cd ~/clack
git pull
npm install

echo "Build server and client:"
npm run build-server
npm run build-client

cp -r ./src/client/static ./dist/client
cp ./src/client/index.html ./dist/client/index.html

sudo cp -r /home/ec2-user/clack/dist/client /var/www/clack

echo "Restart server in tmux session:"
tmux send-keys -t clack C-c
tmux send-keys -t clack "npm run run-server" C-m

echo "Reload nginx:"
sudo systemctl reload nginx




