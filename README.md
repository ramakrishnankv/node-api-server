# Create API with Node with custom host name

At the end of this, one should be able to create a simple Node server that sends responses against specific requests. The app should be able to run with a custom host name using https protocol.

Note: The describptions are based on Windows Operating System, alternative approaches for Mac or Linux are not discussed.

### Table of Contents;
- Initial npm set up for a Node server
- Packages required
- Create Server
  - HTTPS Option
  - Custom host and port
  - System host entry
- How to create an API server with Node?
  - Routes middleware
  - Unhandled Route and Error

## Initial npm set up for a Node server
Open Git Bash from a folder - name it as api-server - and run $ npm init to create a package.json. Follow prompts and instructions, press enter key to containue with default values (wherever mentioned default);
- package name: api-server
- version: default
- description: api server using nodejs
- entry point: server.js
- test command: test
- git repository: default
- keywords: default
- author: default
- license: default

This will create a package.json

## Packages required
Node 13.8.0 and npm 6.13.6 are being used for this example.

For creating this application, it requires to intall latest version of express. Other modules needed are https, path and fs, but this is part of Node and no need to add to the package separately.

Install express - $ npm i express --save

Edit package.json to insert new node "start": "node server.js" under "scripts" node. Create a new file server.js in the root folder and add console.log("helo world"). Run $ npm start which will execute server.js and will print 'helo world' in the console.

## Create server
Refer the file server.js, follow how it requires express, path, https & fs. Create variable app to use express.

let server = https.createServer(options, app).listen(443, 'api.ramki.com');
This creates a server using options (see https options section below) and app, it listens to port 443 with a custom host name 'api.ramki.com' (see custom host section below).

### HTTPS options
createServer() method of https module uses two parameters
 - options, an object that contains key and cert holding self-signed certificate. This parameter is required for https to run securely, but not available for http module.
 - app - the express method that handles the middlewares.
 
 The following commands will generate self-signed certificate. The two files key.pem and cert.pem that are generated should kept in the root folder.

$ openssl genrsa -out key.pem
$ openssl req -new -key key.pem -out csr.pem
$ openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
$ rm csr.pem

Refer for more details: https://nodejs.org/en/knowledge/HTTP/servers/how-to-create-a-HTTPS-server/

Using fs module the two files will be loaded and added as part of options object. The below code will create the options object that loads the self-signed certificate files in server.js.

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

### Custom host and port
The listen() method allows two arguments;
- port number (using 443 here)
- custom host name ('api.ramki.com').

### System host entry
To make the custom host work, it requires to update the host file in the system for dev deplyoment in the local. Windows Start+R and type 'drivers' to search and press enter. This will take to drivers foler. Go to etc folder and open hosts file in notepad. Add the entry 127.0.0.1 api.ramki.com at the bottom and save the file.

At this stage running $ npm start will start the server. Hit https://api.ramki.com in the browser. How different routes are handled are dicussed in the next sections.

## How to create an API server with Node?
In this section will discuss handling routes, creating middleware that can handle incoming requests based on the routes, sending response with certain data.

### Routes middleware
At first create a middleware to handle all routes and within the routes middleware it can map multiple routes with its own middleware.

Create a 'src/routes/index.js 

This file requires Router from express. Use the get method to handle a specific route. The root path ('/') is the primary item to handle. The Router().get method has two arguments the first is the route path and the second one is the middleware function. The middlware function will have three parameters viz., request, response and next. The whole request object of a particular route path is available in the resquest. The response parameter takes what response to be sent back can be added to response object. The next is the call back method will be executed when needed.

Refer 'src/routes/index.js'

Response object is inserted with a json object. res.json function will complete the request response process and send the object passed into the json() function.

Remember the router module must be exported 'moudle.exports = router';

Now, include this file in the 'server.js' file.

const router = require('./src/routes);
router.use(router);

The middleware is ready. Stop the server (Cntrl+C to stop and exit) and start server again with $ npm start command. Hit https://api.ramki.com and see the response printed on the browser.

Here the root path ('/') is handled directly. When the app grows it would ideal to split each middleware seaparate against specific routes. Let us create another middleware to handle '/user'.

Create 'src/routes/user/index.js' - refer this file where, it is almost a duplicate of the middleware function that is written in src/routes/index.js. This module also to be exported to the modules.

In 'src/routes/index.js' require the module and map to '/user' path;

const user = require('./user);
router.get('/user', user);

Restart the server and hit https://api.ramki.com/user, see the response is printed on to the browser correctly.

### Unhandled Route and Error
It is possible that the user may directly edit the URL and send request. This need to be handled. Create another route entry in 'src/routes/index.js' with first parameter with an asterisk ('*') which means it can accept any route paths. 

Refer 'src/routes/index.js', it just writes some html content on to the browser. With this any path entered for instance - 'https://api.ramki.com/products' will be handled by this middleware as there is no speicific middleware defined for this route path.

