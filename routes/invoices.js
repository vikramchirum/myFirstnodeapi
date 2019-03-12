const express = require('express');
const router = express.Router();
const jwt_authorization = require("../lib/jwt_authorization");
const external_api = require('../lib/external_api');

router.use(jwt_authorization.middleware({
    audience: process.env.CUSTOMER_AUDIENCE,
    issuer: process.env.CUSTOMER_ISSUER
}));

router.get('/',
    jwt_authorization.verify_claims_from_request_property('Service_Account_Ids', 'query.service_account_id'),
    async function (req, res, next) {
        try {
            let result = await external_api.search('/api/invoice', req.query);
            req.Result = result;
            next();
        }
        catch (err) {
            next(err);
        }
    },
    external_api.format_result_middleware
);


router.get('/:service_account_id/:invoice_id/details',
    jwt_authorization.verify_claims_from_request_property('Service_Account_Ids', 'params.service_account_id'),
    async function (req, res, next) {
        let result = await  external_api.get('/api/invoice/' + req.params.service_account_id + '/' + req.params.invoice_id  + '/details');
        req.Result = result;
        next();
    },
    external_api.format_result_middleware
);

router.get('/:service_account_id/:invoice_id',
    jwt_authorization.verify_claims_from_request_property('Service_Account_Ids', 'params.service_account_id'),
    async function (req, res, next) {
        try {
            let result = await external_api.get('/api/invoice/' + req.params.service_account_id + '/' + req.params.invoice_id);
            req.Result = result;
            next();
        }
        catch (err) {
            next(err);
        }
    },
    external_api.format_result_middleware
);

module.exports = router;
