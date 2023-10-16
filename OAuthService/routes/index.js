var express = require('express');
var router = express.Router();
const { sendRequest } = require('../../Server/composables/sendRequest');
const fs = require('fs');
const googleRegisterController = require('../controllers/googleRegister');
const passport = require('passport');
require('../controllers/googleAPI');


// Google OAuth - Entry point to Google Auth redirect
router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

// Callback route
router.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/auth/google/success',
  failureRedirect: '/auth/google/failure'
}));

// Handle the SUCCESS redirect route
router.get('/auth/google/success', async(req, res) => {
  await googleRegisterController.handleGoogleRegister(req, res)
});

// Handle the FAILURE redirect route
router.get('/auth/google/failure', (req, res) => {
  var message = 'Authentication failed.'
  res.redirect(`/login?message=${message}`);
});

module.exports = router;
