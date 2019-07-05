const express = require('express');
const router = express.Router({ mergeParams: true });
const service_account_service = require('../../lib/services/service_account_service');

router.use('/autopay', require('./service_accounts.autopay'));

router.use('/budget_billing', require('./service_accounts.budget_billing'));

router.use('/invoices', require('./service_accounts.invoices'));

router.use('/notes', require('./service_accounts.notes'));

router.get('/Meter_Read_Details/:count',
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

router.use('/payment_extension', require('./service_accounts.payment_extensions'));

router.use('/payments', require('./service_accounts.payments'));

router.get('/Service_Orders',
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

router.use('/standard_waivers', require('./service_accounts.waivers'));

router.use('/suspension_letters', require('./service_accounts.suspension_letters'));

router.get('/Usage_History',
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

router.get('/',
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

module.exports = router;
