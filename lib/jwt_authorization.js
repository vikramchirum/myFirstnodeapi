const express_jwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const audience_list = process.env.CUSTOMER_AUDIENCE_LIST.split(',');
const access_public_pem = process.env.JWT_PUBLIC_ACCESS_KEY;
const access_private_pem = new Buffer(process.env.JWT_PRIVATE_ACCESS_KEY);
const refresh_private_pem = new Buffer(process.env.JWT_PRIVATE_REFRESH_KEY);
const refresh_public_pem = new Buffer(process.env.JWT_PUBLIC_REFRESH_KEY);
const _ = require('lodash');

let jwt_auth = {};

jwt_auth.get_standard_options = function (subject, expires_in = '30 min') {
    return {
        algorithm: 'RS256',
        audience: audience_list,
        issuer: process.env.CUSTOMER_ISSUER,
        expiresIn: expires_in,
        subject: subject
    };
};

jwt_auth.get_access_token = function(payload, options){
    return jwt.sign(payload, access_private_pem, options);
};

jwt_auth.get_refresh_token = function(payload, options){
    return jwt.sign(payload, refresh_private_pem, options);
};

jwt_auth.refresh_middleware = function(options){
    let defaults = {
        secret: refresh_public_pem,
        algorithm: 'RS256'
    };
    let new_options = Object.assign(defaults, options);
    return express_jwt(new_options);
};

jwt_auth.middleware = function (options) {
    let defaults = {
        secret: access_public_pem,
        algorithm: 'RS256'
    };
    let new_options = Object.assign(defaults, options);
    return express_jwt(new_options);
};

jwt_auth.verify_admin = function (req, res, next) {
    if (req.user && req.user.claims && req.user.claims.Is_Admin) {
        return next();
    }
    next({status: 401, message: 'You do not have permission to perform this action'});
};

jwt_auth.verify_claims_from_request_property = function (Claim_Name, Request_Property) {
    return function (req, res, next) {
        try {
            let value = _.get(req, Request_Property);
            if (value) {
                jwt_auth.verify_claims(Claim_Name, value)(req, res, next);
            }
            else {
                next();
            }
        }
        catch (err) {
            next(err);
        }
    };
};

jwt_auth.user_has_claim = function(user){
    if (user.claims) {
        if (user.claims.Is_Admin) {
            return next();
        }

        if (user.claims[Claim_Name]) {
            if (user.claims[Claim_Name] === Claim_Value) {
                return true;
            }
            else if (Array.isArray(req.user.claims[Claim_Name])) {
                let contains_value = _.some(req.user.claims[Claim_Name], function (value) {
                    return value === Claim_Value;
                });
                if (contains_value) {
                    return true;
                }
            }
        }
    }
};

jwt_auth.verify_claims = function (Claim_Name, Claim_Value) {
    return function (req, res, next) {
        if (req.user.claims) {
            if (req.user.claims.Is_Admin) {
                return next();
            }

            if (req.user.claims[Claim_Name]) {
                if (req.user.claims[Claim_Name] === Claim_Value) {
                    return next();
                }
                else if (Array.isArray(req.user.claims[Claim_Name])) {
                    let contains_value = _.some(req.user.claims[Claim_Name], function (value) {
                        return value === Claim_Value;
                    });
                    if (contains_value) {
                        return next();
                    }
                }
            }
        }

        next({status: 401, message: 'You do not have permission to perform this action'});
    }
};

module.exports = jwt_auth;
