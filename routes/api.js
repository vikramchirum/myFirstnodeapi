const express = require('express');
const router = express.Router();
const auth_client_cert = require('../lib/auth_client_cert');
const jwt_authorization = require("../lib/jwt_authorization");
const validation_helper = require('../lib/helpers/validation.helper');

if (process.env.CA_CERT) {
    router.use(auth_client_cert(process.env.CA_CERT));
}

router.use('/auth', require('./auth'));

//Require jwt token for all account resources
router.use(jwt_authorization.middleware({
    audience: process.env.AUDIENCE,
    issuer: [process.env.CUSTOMER_ISSUER, process.env.INTERNAL_ISSUER]
}));

router.use('/customer_accounts/:id',
    jwt_authorization.verify_claims_from_request_property('Customer_Account_Id', 'params.id'),
    require('./customer_accounts/customer_accounts')
);

router.use('/service_accounts/:id',
    jwt_authorization.verify_claims_from_request_property('Service_Account_Ids', 'params.id'),
    require('./service_accounts/service_accounts')
);

router.post('/customer_accounts/fuzzy_search',
    jwt_authorization.middleware({
        audience: process.env.AUDIENCE,
        issuer: [process.env.INTERNAL_ISSUER]
    }),
    validation_helper.validation_middleware('fuzzy_search_request'),
    async function (req, res, next) {
        try {
            let result = await customer_account_service.post_fuzzy_search(req.body);
            res.send(result);
        }
        catch (err) {
            next(err);
        }
    });

module.exports = router;
