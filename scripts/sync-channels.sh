#!/bin/bash

set -e
set -x

source .env
TOKEN=$(jwt encode -A HS512 -e=$(($(date +%s) + 30)) --secret "$CORD_SIGNING_SECRET" -P app_id="$CORD_APP_ID")

CHANNEL_FILE="$(dirname "$0")/../channels.txt"
CHANNELS=$(cat "$CHANNEL_FILE" | tr '\n' '#')
curl --oauth2-bearer "$TOKEN" https://api.staging.cord.com/v1/users/all_channels_holder -X PUT --json "{\"metadata\":{\"channels\":\"$CHANNELS\"}}"
echo
