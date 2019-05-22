const express = require('express');
const router = express.Router();
const external_api = require('../lib/external_api');
const jwt = require('jsonwebtoken');
const token_private_pem = new Buffer(process.env.JWT_PRIVATE_ACCESS_KEY);
const refresh_private_pem = new Buffer(process.env.JWT_PRIVATE_REFRESH_KEY);
const refresh_public_pem = new Buffer(process.env.JWT_PUBLIC_REFRESH_KEY);
const audience_list = process.env.CUSTOMER_AUDIENCE_LIST.split(',');
const _ = require('lodash');

const standard_options = function (subject, expires_in = '30 min') {
    return {
        algorithm: 'RS256',
        audience: audience_list,
        issuer: process.env.CUSTOMER_ISSUER,
        expiresIn: expires_in,
        subject: subject
    };
};

router.post('/refresh', function (req, res, next) {
    try {
        jwt.verify(req.body.refresh_token, refresh_public_pem, {algorithms: ['RS256']}, function (err, decoded) {
            if (err) return next(err);

            let access_token = jwt.sign({
                Email: decoded.Email,
                claims: decoded.claims
            }, token_private_pem, standard_options(decoded.sub));
            res.send(access_token);
        })
    }
    catch (err) {
        next(err);
    }
});

router.post('/', async function (req, res, next) {
    try {
        let response = await external_api.post('/api/user/authenticate', req.body);
        let user_creds = response.body;
        let payload = {
            Email: user_creds.Profile.Email_Address,
            claims: {}
        };

        if (user_creds.Account_permissions){
            let customer_account = _.find(user_creds.Account_permissions, function(permission){
                return permission.AccountType === 'Customer_Account_Id';
            });
            let service_accounts = _.filter(user_creds.Account_permissions, function(permission){
                return permission.AccountType === 'Service_Account_Id';
            });
            if (customer_account){
                payload.claims.Customer_Account_Id = customer_account.AccountNumber;
            }
            if (service_accounts){
                payload.claims.Service_Account_Ids = _.map(service_accounts, function(service_account){
                    return service_account.AccountNumber;
                });
            }
        }

        let token = jwt.sign(payload, token_private_pem, standard_options(user_creds.Profile.Username));
        let refresh_token = jwt.sign(payload, refresh_private_pem, standard_options(user_creds.Profile.Username, '1 week'));
        res.send({access_token: token, refresh_token: refresh_token});
    }
    catch (err) {
        if (err.stack && err.status && err.status < 500) {
            res.status(err.status).send(err.response.body.Message);
        }
        else {
            next(err);
        }
    }
});

module.exports = router;
