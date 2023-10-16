var express = require('express');
var router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const sendRequest = require("../composables/sendRequest").sendRequest;
const request = require('request');



// Google OAuth - Entry point to Google Auth redirect
router.get('/auth/google', (req, res) => {
    // Forward the request to the Google OAuth microservice.
    res.redirect(`${process.env.OAUTH_SERVICE_URL}/auth/google`);
    /**request(`${process.env.OAUTH_SERVICE_URL}/auth/google`, (error, response, body) => {
      if (error) {
        // Handle error
        res.status(500).send('Internal Server Error');
      } else {
        res.send(body);
      }
    });*/
  });
/**
// Handle the SUCCESS redirect route  
router.get('/auth/google/success', (req, res) => {
    request(`${process.env.OAUTH_SERVICE_URL}/auth/google/success`, (error, response, body) => {
        if (error) {
        // Handle error
        res.status(500).send('Internal Server Error');
        } else {
        res.send(body);
        }
    });
});

// Handle the CALLBACK redirect route
router.get('/auth/google/callback', (req, res) => {
    // Forward the request to the Google OAuth microservice.
    request(`${process.env.OAUTH_SERVICE_URL}/auth/google/callback`, (error, response, body) => {
        if (error) {
        // Handle error
        res.status(500).send('Internal Server Error');
        } else {
        res.send(body);
        }
    });
});

router.get('/auth/google/failure', (req, res) => {
    // Forward the request to the Google OAuth microservice.
    request(`${process.env.OAUTH_SERVICE_URL}/auth/google/failure`, (error, response, body) => {
        if (error) {
        // Handle error
        res.status(500).send('Internal Server Error');
        } else {
        res.send(body);
        }
    });
});
 */

module.exports = router;
