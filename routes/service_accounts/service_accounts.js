const express = require('express');
const router = express.Router();
const jwt_authorization = require("../../lib/jwt_authorization");
const service_account_service = require('../../lib/services/service_account_service');

router.use('/:id/auth', require('./service_accounts.auth'));

router.use(jwt_authorization.middleware({
    audience: process.env.AUDIENCE,
    issuer: [process.env.CUSTOMER_ISSUER, process.env.INTERNAL_ISSUER]
}));

router.use('/:id/invoices', require('./service_accounts.invoices'));

router.use('/:id/payment_extension', require('./service_accounts.payment_extensions'));

router.use('/:id/payments', require('./service_accounts.payments'));

router.get('/:id',
    jwt_authorization.verify_claims_from_request_property('Service_Account_Ids', 'params.id'),
    async function (req, res, next) {
        try {
            let result = await service_account_service.get_by_id(req.params.id);
            if (result) {
                res.send(result);
            }
            else {
                res.sendStatus(404);
            }
        }
        catch (err) {
            next(err);
        }
    }
);

router.get('/',
    jwt_authorization.verify_claims_from_request_property('Service_Account_Ids', 'query.service_account_id'),
    jwt_authorization.verify_claims_from_request_property('Customer_Account_Id', 'query.customer_account_id'),
    async function (req, res, next) {
        try {
            let result = await service_account_service.search(req.query);
            res.send(result);
        }
        catch (err) {
            next(err);
        }
    }
);

router.get('/:id/Suspension_Info',
    jwt_authorization.verify_claims_from_request_property('Service_Account_Ids', 'params.id'),
    async function (req, res, next) {
        try {
            let result = await service_account_service.get_suspension_info(params.id);
            res.send(result);
        }
        catch (err) {
            next(err);
        }
    }
);

router.get('/:id/Voided_Rejected_Info',
    jwt_authorization.verify_claims_from_request_property('Service_Account_Ids', 'params.id'),
    async function (req, res, next) {
        try {
            let result = await service_account_service.get_voided_rejected_info(params.id);
            res.send(result);
        }
        catch (err) {
            next(err);
        }
    }
);

module.exports = router;
