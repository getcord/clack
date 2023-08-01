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

### Deployment

The deployed version is currently in a separate AWS account, running on the same EC2 as the AI chatbot

You can SSH into the machine to update and restart the code.  

To SSH in:
- Copy the PEM file out of 1Password
  (https://start.1password.com/open/i?a=IESAV4H5UNCRXA5QAVSNPQBP4Y&v=usplbt3iqrvwl75jhpzlugpm6u&i=sl3z5cj3rsj4bpu5wnntgrdlmi&h=getcord.1password.com)
- Save it somewhere on your computer, this assumes you put in on your desktop
- Run `ssh -v -i ~/Desktop/ai-bot-ssh-key.pem ec2-user@35.93.64.39
- Run `tmux list-sessions` to see the running sessions 
- Run `tmux attach -t clack` to attach to the Clack tmux session (which is running both client and server)
- To exit the session without killing it, press Ctrl + b together, let go, then d

- To update:
  - Kill the current process
  - Git pull, npm i, whatever
  - `npm run prod` to rebuild and restart

The client is being served by nginx from /var/www/clack.  The script run by `npm run prod`
copies the files there and restarts nginx.
