# Ex3-server

## This project is the back end of the web application of facebook.

### Made by: Tamar Hessen, Sapir Yanai, and Daniel Lifshitz.

## How to run:

First run

### `npm install`    

and then if you use windows run:

### `npm run windows`

or otherwise if you use linux or macOS run:

### `npm run linux`

and then open in browser

### `http://localhost:5000`

This will run the facebook app in the login window.  
### Make sure to have mongoDB installed in your computer and have a DB in the address of `mongodb://127.0.0.1:27017`.
This is because the server to the database in this address.


# Files:

### `App.js`
This file activates the other pages, and allows you to access the chat page only if you are logged in.

## Server
The server is build using `MVC`, and other folders such as `middleware` and `services`.  
The folder `middleware` is used to get the username out of the token sent to the server.  
The folder `services` is used to communicate against mongoDB and the database.
The folder `config` with the .env.local file contains the port numbers and ip adresses needed
### The public folder:

This folder holds the entire css and js of the client side.


## Notes
The `/feed` path is blocked, and is only reachable via login.



