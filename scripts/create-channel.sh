#!/bin/bash

set -e
set -x

if [ $# -ne 1 ]
then
  echo "Usage: $0 channel-name"
  exit 1
fi

NEW_CHANNEL="$1"
if [ -z "$NEW_CHANNEL" ]
then
  echo "Invalid channel name"
  exit 1
fi

source .env
TOKEN=$(jwt encode -A HS512 -e=$(($(date +%s) + 30)) --secret "$CORD_SIGNING_SECRET" -P app_id="$CORD_APP_ID")

CURRENT_CHANNELS=$(curl --oauth2-bearer "$TOKEN" https://api.staging.cord.com/v1/users/all_channels_holder | jq -r '.metadata.channels')
UPDATED_CHANNELS="$CURRENT_CHANNELS#$NEW_CHANNEL"

curl --oauth2-bearer "$TOKEN" https://api.staging.cord.com/v1/users/all_channels_holder -X PUT --json "{\"metadata\":{\"channels\":\"$UPDATED_CHANNELS\"}}"
echo
