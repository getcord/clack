## Clack

Welcome to Clack!  This is where Cord's internal communication happens.  You 
can find it at https://clack.cord.com

### Things to note
Clack connects to the STAGING deployment of Cord, so changes landed to monorepo 
throughout the day will be instantly available.

If you want to run it against your LOCAL build, e.g. to test changes you're making
in monorepo, set
`cordScriptUrl="https://local.cord.com:8179/sdk/v1/sdk.latest.js"`
on the CordProvider in src/client/App.tsx

and in src/server/consts.ts set `export const CORD_API_URL = 'https://local.cord.com:8161/v1/';`
instead of the real staging API endpoint.

You may need to bootstrap your db if it's the first time you're doing this, to 
get the application info (see ./scripts/bootstrap-database.sh in monorepo)

### Local setup

Create a .env like

```
CLACK_ENV=development
CORD_SIGNING_SECRET=<SECRET>
CORD_APP_ID=<APP_ID>
SLACK_CLIENT_ID=<ID>
SLACK_TEAM=<TEAM>
SLACK_CLIENT_SECRET=<SECRET>
```

(For the main Cord installation there's a file in 1password with all the credentials filled out.)

Run `./scripts/generate-localhost-cert.sh` to generate https certificates for localhost.

Run `npm run dev` and visit https://local.cord.com:7307

Note: Must have node v16.15 or newer, as we use `node --experimental-fetch` flag.
(although this is consistent with Node's changelog, experience suggests 16.15
might not be enough.  16.20 should be fine)

### Deployment

The deployed version is currently in a separate AWS account, running on the same EC2 as the AI chatbot

You can SSH into the machine to update and restart the code.  

To SSH in:
- Copy the PEM file out of 1Password
  (https://start.1password.com/open/i?a=IESAV4H5UNCRXA5QAVSNPQBP4Y&v=usplbt3iqrvwl75jhpzlugpm6u&i=sl3z5cj3rsj4bpu5wnntgrdlmi&h=getcord.1password.com)
- Save it somewhere on your computer, this assumes you put in on your desktop
- Run `ssh -v -i ~/Desktop/ai-bot-ssh-key.pem ec2-user@35.93.64.39
- Run `tmux list-sessions` to see the running sessions 
- Run `tmux attach -t clack` to attach to the Clack tmux session which is running the server
- To exit the session without killing it, press Ctrl + b together, let go, then d

- To redeploy: 
  - Option 1:
    - Run the workflow! https://github.com/getcord/clack/actions/workflows/deploy.yml  
  - Option 2:
    - ssh into the machine
    - Git pull, npm i, whatever
    - Attach to the existing tmux clack session (`tmux attach -t clack`)
      - kill the existing server process that's running there
      - `npm run prod` to rebuild and restart both client and server
  

The client is being served by nginx from /var/www/clack.  The script run by `npm run prod`
copies the files there and restarts nginx.

Alternatively the github action curls another server running in the clack-update-server session, which runs ./ci/scripts/update.sh.  This also rebuilds and restarts everything, but additionally does a git pull/npm i, and restarts the server in the clack tmux session (yes this is all bonkers).
