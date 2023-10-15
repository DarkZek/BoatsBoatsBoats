const ProductController = require('../controllers/product');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
let controller = null;
const fs = require('fs');
const { MongoClient } = require('mongodb');

const handleGoogleRegister = async (req, res) => {
    this.client = new MongoClient(process.env.DB_URI);
    this.database = this.client.db('shop');
    this.collection = this.database.collection('users');
    const email = req.user.email;
    const hashedPwd = await bcrypt.hash("GOOGLE", 10);

    // If !Email --> Throw error
    if (!email) {
        return res.status(500).json({ 'message': 'Something went very wrong. Please contact the website admin.' });
    }

    // If Email --> Check if the user has an account in the DB already
    const foundUser = this.collection.findOne({username: {$in:[email]}});

    // If User already in DB --> Authenticate GoogleUser
    if (foundUser) {

        // Authenticate
        const loginData = {
            user: email,
            pwd: "GOOGLE"
        };
        await handleGoogleLogin({ body: loginData }, res);
    }

    // If user not in DB --> Register & Authenticate GoogleUser
    if (!foundUser) {

        // Register
        try {
            const newUser = {
                'username': email,
                'roles': { "User": 7777 },
                'password': hashedPwd,
                'refreshToken': ""
            };
            await this.collection.insertOne(newUser);
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }

        // Authenticate
        const loginData = {
            user: email,
            pwd: "GOOGLE"
        };
        await handleGoogleLogin({ body: loginData }, res);
    }
}



// Handles the login & redirection
const handleGoogleLogin = async (req, res) => {
    const { user, pwd } = req.body;

    // If we don't get both a username & password --> Send a bad request response with a message
    if (!user || !pwd) return res.status(400).json({ 'message': 'Valid email and password required.' });

    // Try to find the username in DB
    const foundUser = this.collection.findOne({username: {$in:[user]}});

    // If we can't find it --> Unauthorized
    if (!foundUser) return res.status(401).json({ 'message': 'Authentication failed. Please provide valid credentials to access this webpage.' });

    const roles = Object.values(foundUser.roles);
    // Create JWT Normal & Refresh
    const accessToken = jwt.sign(
        { "UserInfo": { "username": foundUser.username, "roles": roles } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '59s' }
    );
    const refreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
    );

    // Update the user's refreshToken in the DB
    //await controller.updateRefreshToken(foundUser.username, refreshToken);
    let username = foundUser.username;
    await this.collection.updateOne({ username}, { $set: { refreshToken } });

    // Redirect with the access token as a query 
    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
    res.redirect(`/?accessToken=${accessToken}`);

};


module.exports = { handleGoogleRegister };

