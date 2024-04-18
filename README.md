## Clack

Welcome to Clack!  This is where Cord's internal communication happens.  You can
find it at https://clack.cord.com, though if you're not a Cord employee you
won't be able to log in.

### Trying it out

If you want to try out Clack for yourself, create a new project in the [Cord
console](https://console.cord.com), then use the project ID and secret to create
a .env file that looks like this:

```
CLACK_ENV=development
CLACK_AUTH_METHOD=fake
CORD_SIGNING_SECRET=<SECRET>
CORD_APP_ID=<PROJECT_ID>
```

Run `./scripts/generate-localhost-cert.sh` to generate https certificates for
localhost.

Finally, run `npm run dev` and visit https://local.cord.com:7307

## Cord Employees

See the Clack file in Notion for instructions.
