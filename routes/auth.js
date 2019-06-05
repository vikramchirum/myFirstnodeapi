const express = require('express');
const router = express.Router();
const external_api = require('../lib/external_api');
const jwt = require('jsonwebtoken');
const token_private_pem = new Buffer(process.env.JWT_PRIVATE_ACCESS_KEY);
const refresh_private_pem = new Buffer(process.env.JWT_PRIVATE_REFRESH_KEY);
const refresh_public_pem = new Buffer(process.env.JWT_PUBLIC_REFRESH_KEY);
const audience_list = process.env.CUSTOMER_AUDIENCE_LIST.split(',');
const _ = require('lodash');
const jwt_authorization = require('../lib/jwt_authorization');
const validation_helper = require('../lib/helpers/validation.helper');
const cache_service = require('../lib/services/cache_service');

const standard_options = function (subject, expires_in = '30 min') {
    return {
        algorithm: 'RS256',
        audience: audience_list,
        issuer: process.env.CUSTOMER_ISSUER,
        expiresIn: expires_in,
        subject: subject
    };
};

router.post('/preauth',
    jwt_authorization.middleware({
        audience: process.env.AUDIENCE,
        issuer: process.env.INTERNAL_ISSUER
    }),
    jwt_authorization.verify_claims('Can_Check_For_Pre_Auth', true),
    validation_helper.validation_middleware('pre_auth_request'),
    async function (req, res, next) {

        let phone_number = req.pre_auth_request.Phone_Number;
        let csp_ids = await cache_service.get_by_phone(phone_number);
        if (csp_ids && csp_ids.length > 0)
            res.send({Service_Account_Id: csp_ids[0]});
        res.send(csp_ids);
    });

router.post('/saveauth',
    jwt_authorization.middleware({
        audience: process.env.AUDIENCE,
        issuer: process.env.INTERNAL_ISSUER
    }),
    jwt_authorization.verify_claims('Can_Save_Auth', true),
    validation_helper.validation_middleware('save_auth_request'),
    async function (req, res, next) {
        let cache_info = await cache_service.save_auth(req.save_auth_request);
        res.send(cache_info);
    });

router.post('/generate',
    jwt_authorization.middleware({
        audience: process.env.AUDIENCE,
        issuer: [process.env.INTERNAL_ISSUER]
    }),
    jwt_authorization.verify_claims('Can_Generate_Token', true),
    validation_helper.validation_middleware('generate_token_request'),
    function (req, res, next) {
        try {
            let options = {
                algorithm: 'RS256',
                audience: audience_list,
                issuer: process.env.INTERNAL_ISSUER,
                subject: req.generate_token_request.Name
            };
            const payload = {
                claims: {Is_Admin: true}
            };
            const access_token = jwt.sign(payload, token_private_pem, options);
            options.expiresIn = '1 week';
            const refresh_token = jwt.sign(payload, refresh_private_pem, options);
            res.send({access_token: access_token, refresh_token: refresh_token});
        }
        catch (err) {
            next(err);
        }
    });

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

router.post('/',
    validation_helper.validation_middleware('login_request'),
    async function (req, res, next) {
        try {
            let response = await external_api.post('/api/user/authenticate', req.body);
            let user_creds = response.body;
            let payload = {
                Email: user_creds.Profile.Email_Address,
                claims: {}
            };

            if (user_creds.Account_permissions) {
                let customer_account = _.find(user_creds.Account_permissions, function (permission) {
                    return permission.AccountType === 'Customer_Account_Id';
                });
                let service_accounts = _.filter(user_creds.Account_permissions, function (permission) {
                    return permission.AccountType === 'Service_Account_Id';
                });
                if (customer_account) {
                    payload.claims.Customer_Account_Id = customer_account.AccountNumber;
                }
                if (service_accounts) {
                    payload.claims.Service_Account_Ids = _.map(service_accounts, function (service_account) {
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
