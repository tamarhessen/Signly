# Signly

## This project is the front end of the web application of signly.

### Made by: Tamar Hessen and Sapir Yanai


## Run:
```
npm install
npm start
```

## App.js:
This file is the base of the app and present the page depending on the path.

If / then it will show the login page.

If /home and the user is logged in then it will show the feed page.

If /home and the user isn't logged in then it will redirect to /.

Otherwise, it will redirect to /.

## Login.js:
If the path of the url is / then this file will be called.

In this file we show the starting screen.

When pressing on new account it will show the Sign-up modal.

When pressing on Log in it will send to the correct feed page.

## Signup.js
In this file we hold the code for the sign-up modal.

The user enters a username (must be different from any other username), password (has to be at least 8 letters), confirm password (=== password), display name (no limit), profile picture (no limit).

If all the limits are met, the user can log in using this account.

## Users.js
We hold the entire data of the users in Users.js

All the function that check the users data in login and signup is checked there.

## App/Login/signup.css
All the visualization of the pages of app, login, and signup happens in those files.


## LightModeFeed/NightModeFeed.css

These files hold the visualization of the feed depending on which mode is now active.


