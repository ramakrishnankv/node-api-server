const express = require('express');
const router = express.Router();
const user = require('./user');

// inline middleware function to handle request from root path '/'
router.get('/', (req, res, next) => {
    res.json({
        name: 'Helo World'
    })
})

// separated middleware function user to handle requests from '/user' path
router.get('/user', user);

// handle all other requests
router.get('*', (req, res, next) => {
    // res.write("<h1>Error</h1><div>Sorry, something went wrong!</div>");
    // res.end();
    res.send("<h1>Error</h1><div>Sorry, something went wrong!</div>");
})

module.exports = router;