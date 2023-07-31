#!/bin/bash

trap 'kill $(jobs -p)' EXIT

set -e
set -x

tsc --watch --preserveWatchOutput &

npm run build-server &
npm run build-client &

cp -r ./src/client/static ./dist/client/static & 
cp -r ./src/client/index.html ./dist/client/index.html & 

npm run run-server &
npm run run-client &

wait
