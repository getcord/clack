#!/bin/bash

trap 'kill $(jobs -p)' EXIT

set -e
set -x

tsc --watch --preserveWatchOutput &

# Do a single build first, synchronously, so that we know something exists
# before trying to launch.
npm run build-server
npm run build-client
npm run build-server -- --watch=forever &
npm run build-client -- --watch=forever &

cp -r ./src/client/static ./dist/client/static & 
cp -r ./src/client/index.html ./dist/client/index.html & 

npm run run-server-dev &
npm run run-client-dev &

wait
