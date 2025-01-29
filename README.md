# Signly

## This project is the front end of the web application of facebook.

### Made by: Tamar Hessen, Sapir Yanai, and Daniel Lifshitz.


## Run:
```
npm install
npm start
```

# No need to download here anything, by running the items in the server you can get the same code running in localhost:5000
## This is only if you want to read the code, although it will run on localhost:3000.

## App.js:
This file is the base of the app and present the page depending on the path.

If / then it will show the login page.

If /feed and the user is logged in then it will show the feed page.

If /feed and the user isn't logged in then it will redirect to /.

Otherwise, it will redirect to /.

## Login.js:
If the path of the url is / then this file will be called.

In this file we show the starting screen of facebook.

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

## feed folder
## FeedScreen.js
This file separates the feed page into two parts, the navigation bar on top, and the main screen on the bottom.

## InfoBar.js
This files separates the navigation bar into 3 parts: right, left, and center.

On the right side we have 4 buttons and a picture, all the buttons don't do anything right now, and the picture is the profile picture of the user.

In the center we have 3 buttons using svg format to show a drawing instead of a word.

On the left side we have the facebook logo (when pressed the user gets sent to the login screen), and the search bar (currently doesn't do anything).

## MainScreen.js
This files separates the main screen into 3 parts, the right column, the center colum, and the left column, the center column is the main part of the feed screen and thus it is twice as big as the other columns.

## MainRight.js
This file has two buttons, night-mode/light-mode button (when pressed switches the css from the css for light-mode to the css for night-mode and back),

The second button is the log-out button that when pressed sends back to the login page.

## MainCenter.js
This file holds the feed column, it calls Posts.js which shows 10 static posts, and an option to add more posts.

## Posts.js

This file holds 10 static posts, and an option to add more posts.

## Post.js

This file gets the data of a post, and returns the html for that post.

## Comments.js

This file gets the data of a comments list, and returns the html for that list.

## Comment.js

This file gets the data of a comment, and returns the html for that comment.

## AddComment.js

When clicked on the add comment button it shows the option to add a comment.

## LightModeFeed/NightModeFeed.css

These files hold the visualization of the feed depending on which mode is now active.


