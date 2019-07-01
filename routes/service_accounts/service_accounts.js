const express = require('express');
const router = express.Router();
const jwt_authorization = require("../../lib/jwt_authorization");
const service_account_service = require('../../lib/services/service_account_service');

router.use('/:id/auth', require('./service_accounts.auth'));

router.use(jwt_authorization.middleware({
    audience: process.env.AUDIENCE,
    issuer: [process.env.CUSTOMER_ISSUER, process.env.INTERNAL_ISSUER]
}));

router.use('/:id/autopay', require('./service_accounts.autopay'));

router.use('/:id/suspension_letters', require('./service_account.suspension_letters'));

router.use('/:id/budget_billing', require('./service_accounts.budget_billing'));

router.use('/:id/invoices', require('./service_accounts.invoices'));

router.use('/:id/payment_extension', require('./service_accounts.payment_extensions'));

router.use('/:id/payments', require('./service_accounts.payments'));

router.use('/:id/notes', require('./service_account.notes'));

router.use('/:id/notification_options', require('../customer_accounts/customer_accounts.notification_options'));

router.use('/:id/standard_waivers', require('./service_account.waivers'));

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

router.get('/:id/Usage_History',
    jwt_authorization.verify_claims_from_request_property('Service_Account_Ids', 'params.id'),
    async function (req, res, next) {
        try {
            let result = await service_account_service.get_usage_history(req.params.id);
            res.send(result);
        }
        catch (err) {
            next(err);
        }
    }
);

router.get('/:id/Service_Orders',
    jwt_authorization.verify_claims_from_request_property('Service_Account_Ids', 'params.id'),
    async function (req, res, next) {
        try {
            let result = await service_account_service.get_service_orders(req.params.id);
            res.send(result);
        }
        catch (err) {
            next(err);
        }
    }
);

router.get('/:id/Meter_Read_Details/:count',
    jwt_authorization.verify_claims_from_request_property('Service_Account_Ids', 'params.id'),
    async function (req, res, next) {
        try {
            if(!req.params.count || req.params.count === "0") {
               req.params.count = 20;
            }

            let result = await service_account_service.get_meter_read_details(req.params.id, req.params.count);
            res.send(result);
        }
        catch (err) {
            next(err);
        }
    }
);

module.exports = router;
