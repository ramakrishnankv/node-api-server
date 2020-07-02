const express = require('express');
const app = express();
const path = require('path');
const https = require('https');
const fs = require('fs');

const router = require('./src/routes');

app.use(router);

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
}

let server = https.createServer(options, app).listen(443, 'api.ramki.com');

