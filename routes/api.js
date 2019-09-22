const express = require('express');
const router = express.Router();
const auth_client_cert = require('../lib/auth_client_cert');
const jwt_authorization = require("../lib/jwt_authorization");
const validation_helper = require('../lib/helpers/validation.helper');
const service_account_service = require('../lib/services/service_account_service');
const customer_account_service = require('../lib/services/customer_account_service');

if (process.env.CA_CERT) {
    router.use(auth_client_cert(process.env.CA_CERT));
}

router.use('/auth', require('./auth'));

router.use('/users', require('./users'));

router.use('/announcements', require('./announcements'));

//Require jwt token for all account resources
router.use(jwt_authorization.middleware({
    audience: process.env.AUDIENCE,
    issuer: [process.env.CUSTOMER_ISSUER, process.env.INTERNAL_ISSUER]
}));

router.use('/customer_accounts/:id',
    jwt_authorization.verify_claims_from_request_property('Customer_Account_Id', 'params.id'),
    require('./customer_accounts/customer_accounts')
);

router.put('/service_accounts/:id/disconnect',
    jwt_authorization.verify_admin,
    validation_helper.validation_middleware('disconnect_request'),
    async function (req, res, next) {
        try {
            let disconnect_request =
                {
                    User_Name: req.user.sub,
                    Service_Stop_Date: req.disconnect_request.Service_Stop_Date,
                    Final_Bill_To_Old_Billing_Address: req.disconnect_request.Is_Final_Bill_To_Old_Billing_Address,
                    Final_Bill_Address: req.disconnect_request.Final_Bill_Address
                };
            let result = await service_account_service.disconnect(req.params.id, disconnect_request)
            res.send(result);
        }
        catch (err) {
            next(err);
        }
    });

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
