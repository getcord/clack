Very silly hacky way to automatically update changes

A little express server that literally just listens for a call and then will 
git pull and rebuild/restart code

Call needs to have a secret in the Auth header.  This is stored in Github actions, and is also in the .env in 1Pass.