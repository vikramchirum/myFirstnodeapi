const jwt = require('express-jwt');
const public_pem = process.env.JWT_PUBLIC_ACCESS_KEY;
const _ = require('lodash');

let jwt_auth = {};

jwt_auth.middleware = function (options) {
    let defaults = {
        secret: public_pem,
        algorithm: 'RS256'
    };
    let new_options = Object.assign(defaults, options);
    return jwt(new_options);
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
