# ASLS

## A./ Installation & Deployment

### 1. Install environment
<code>npm install -g yarn</code>

<code>yarn global add create-react-app</code>

<code>yarn global add eslint-config-react-app@0.3.0 eslint@3.8.1 babel-eslint@7.0.0 eslint-plugin-react@6.4.1 eslint-plugin-import@2.0.1 eslint-plugin-jsx-a11y@4.0.0 eslint-plugin-flowtype@2.21.0</code>

<code>yarn && yarn install-source</code>


### 2. Run in dev mode

<code>yarn dev</code>

**NOTES:**
- API server will serve on http://localhost:4040
- WEB server will serve on http://localhost:3000


### 3. Deploy

<code>yarn build</code>

<code>yarn deploy</code>

**NOTES:**
- Complete these two commands above will deploy API and WEB source on the same server.
- Before run build command, check and correct the information in src/api/.env.production file.
- Before run deploy command: check and correct information from deploy.heroku section in package.json file.

**DEPLOYMENT ISSUE:**
When deploy to heroku, we may see error message below. To fix this, run command to force push into heroku then run deploy command again.

<code>To https://git.heroku.com/asls.git
 ! [remote rejected] master -> master (pre-receive hook declined)
error: failed to push some refs to 'https://git.heroku.com/asls.git'
Error: git push heroku master:master --set-upstream => 1 (error)</code>

<code>git push heroku master --force</code>


## B./ Manually deploy on heroku

**Push postgres DB from localhost to heroku**

<code>heroku pg:push ASLS DATABASE_URL --app asls</code>

**add upstream**

<code>git remote add heroku https://git.heroku.com/asls.git</code>

<code>git push heroku master</code>