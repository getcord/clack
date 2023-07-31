Create a .env like

```
NODE_ENV=development
CORD_SIGNING_SECRET=<SECRET>
CORD_APP_ID=<APP_ID>
SLACK_CLIENT_ID=<ID>
SLACK_TEAM=<TEAM>
SLACK_CLIENT_SECRET=<SECRET>
```

(For the main Cord installation there's a file in 1password with all the credentials filled out.)

Run `./scripts/generate-localhost-cert.sh` to generate https certificates for localhost.
