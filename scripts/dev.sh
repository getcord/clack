#!/bin/bash

trap 'kill $(jobs -p)' EXIT

set -e
set -x

tsc --watch --preserveWatchOutput &

npm run build-client &
npm run build-server &

npm run run-server &
npm run run-client &

wait
