# ASLS

## A./ Installation & Deployment

### 1. Install environment
<pre>npm install -g yarn</pre>

<pre>yarn global add create-react-app</pre>

<pre>yarn global add eslint-config-react-app@0.3.0 eslint@3.8.1 babel-eslint@7.0.0 eslint-plugin-react@6.4.1 eslint-plugin-import@2.0.1 eslint-plugin-jsx-a11y@4.0.0 eslint-plugin-flowtype@2.21.0</pre>

<pre>yarn && yarn install:all</pre>


### 2. Run in dev mode

<pre>yarn dev</pre>

**NOTES:**
- API server will serve on http://localhost:4040
- WEB server for admin will serve on http://localhost:3001
- WEB server for client will serve on http://localhost:3000


### 3. Deployment

**Prerequisite**
We MUST run all command in **point 1** above to install build and deploy environtment


**Step 1: add upstream**

<pre>git remote add heroku https://git.heroku.com/asls.git</pre>

Replace https://git.heroku.com/asls.git by your actual git url on heroku


**Step 2: push source to heroku**

<pre>git push heroku master --force</pre>


**Step 3: compile (build) source locally**

Before run build command, check and correct the information below from src/api/.env.production file.
* JWT_SECRET=This is a secret key that will be used to encrypt login token
* POSTGRES_CONNECTION=This is the connectrion string that will be used to connect postgres database server

Run this command to build source:

<pre>yarn build</pre>


**Step 4: push compiled source to heroku**

Before run deploy command: check and correct information from deploy => heroku section in package.json file.

<pre>
"deploy": {
   "heroku": {
     "name": "heroku", // Keep this
     "url": "https://git.heroku.com/asls.git", // Change this: it will be your git url that you added in Step 1
     "branch": "master", // Keep this
     "website": "https://asls.herokuapp.com" // Change this: it will be url when you create app with heroku from command line
   }
 }
 </pre>

Run this command to deploy the compiled source:

<pre>yarn deploy</pre>

## B./ View logs on heroku in console
heroku logs --tail --app asls

Replace asls by your actual application name when you created app
