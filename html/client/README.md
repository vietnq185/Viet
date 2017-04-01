[ ![Codeship Status for
inspicorp_lightning/lightning-client](https://codeship.io/projects/207c8650-ed30-0131-838b-4216c01ccc74/status)](https://codeship.io/projects/26654)

# README #
Client code for Inspicorp's Lightning project 
 
### Quick start ### 

If you do not have grunt installed:

```
#!bash

sudo npm install -g grunt-cli
```

If you do not have compass-sass installed:

```
#!bash

sudo apt-get install ruby   # If you dont have gem installed
sudo gem install compass
```

Install node_modules and bower_components:

```
#!shell

sudo npm install
bower install
```

### Build, compile and deploy ###

To compile for development, type:

```
#!bash

grunt serve
```
To compile for deployment, type:

```
#!bash

grunt serve:dist
```

This command creates a 'dist' folder in the working directory.  You can use the content in this 'dist' folder to deploy to Heroku.

grunt test:client
```