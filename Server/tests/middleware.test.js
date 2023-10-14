const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const app = require('express')(); 
const ROLES_LIST = require('../config/rolesList');
const verifyJWT = require('../middleware/verifyJWT'); 
const verifyRoles = require('../middleware/verifyRoles'); 
require('dotenv').config();

chai.use(chaiHttp);
const expect = chai.expect;

/**
 * verifyJWT Tests
 */

describe('verifyJWT Middleware', () => {
    it('should call next() for a valid JWT token', (done) => {
        const token = jwt.sign({ UserInfo: { username: 'test', roles: ['user'] } }, process.env.ACCESS_TOKEN_SECRET);
        const req = { headers: { authorization: `Bearer ${token}` } };
        const res = {};
        verifyJWT(req, res, () => {
            expect(req.user).to.equal('test');
            expect(req.roles).to.deep.equal(['user']);
            done();
        });
    });

    it('should return a 403 Forbidden response for an invalid JWT token', (done) => {
        const invalidToken = 'invalid_token';
        const req = { headers: { authorization: `Bearer ${invalidToken}` } };
        const res = {
            status: (statusCode) => {
                expect(statusCode).to.equal(403);
                return {
                    json: (response) => {
                        expect(response.message).to.equal('Forbidden');
                        done();
                    },
                };
            },
        };
        verifyJWT(req, res, () => {
            done(new Error('The middleware should not call next for an invalid token.'));
        });
    });

    it('should return a 401 Unauthorized response for no token', (done) => {
        const req = { headers: {} }; // No authorization header
        const res = {
            status: (statusCode) => {
                expect(statusCode).to.equal(401);
                return {
                    json: (response) => {
                        expect(response.message).to.equal('Unauthorized');
                        done();
                    },
                };
            },
        };
        verifyJWT(req, res, () => {
            done(new Error('The middleware should not call next for no token.'));
        });
    });
});


/**
 * verifyRoles Tests
 */


describe('verifyRoles Middleware', () => {
    
    it('should allow access for a user with valid role', (done) => {
        const req = {
            roles: [ROLES_LIST.User],
        };
        const res = {};
        verifyRoles(ROLES_LIST.User)(req, res, () => {
            expect(res.status).to.not.exist;
            done();
        });
    });

    it('should allow access for a user with Admin role', (done) => {
        const req = {
            roles: [ROLES_LIST.User, ROLES_LIST.Admin],
        };
        const res = {};
        verifyRoles(ROLES_LIST.Admin)(req, res, () => {
            expect(res.status).to.not.exist;
            done();
        });
    });
    

    it('should return a 401 Unauthorized response for a valid user with non-matching role', (done) => {
        const user = {
            username: 'Userkoolguy420@gmail.com',
            roles: [ROLES_LIST.User],
        };
        const token = jwt.sign({ UserInfo: user }, process.env.ACCESS_TOKEN_SECRET);
        const req = {
            headers: { authorization: `Bearer ${token}` },
            user: user, // Mock the user information in the request
        };
        const res = {
            status: (statusCode) => {
                expect(statusCode).to.equal(401);
                return {
                    json: (response) => {
                        expect(response.message).to.equal('Unauthorized');
                        done();
                    },
                };
            },
        };
        const next = () => {
            done(new Error('The middleware should not call next for a user with non-matching role.'));
        };
        verifyRoles(ROLES_LIST.Admin)(req, res, next);
    });

    it('should return a 401 Unauthorized response for a user with no roles', (done) => {
        const user = {
            username: 'Userkoolguy420@gmail.com',
            roles: [],
        };
        const token = jwt.sign({ UserInfo: user }, process.env.ACCESS_TOKEN_SECRET);
        const req = {
            headers: { authorization: `Bearer ${token}` },
            user: user, 
        };
        const res = {
            status: (statusCode) => {
                expect(statusCode).to.equal(401);
                return {
                    json: (response) => {
                        expect(response.message).to.equal('Unauthorized');
                        done();
                    },
                };
            },
        };
        const next = () => {
            done(new Error('The middleware should not call next for a user with no roles.'));
        };
        verifyRoles(ROLES_LIST.User)(req, res, next);
    });

});