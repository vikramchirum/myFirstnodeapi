const express = require('express');
const router = express.Router({mergeParams: true});
const payment_service = require('../../lib/services/payment_service');
const validation_helper = require('../../lib/helpers/validation.helper');

router.get('/',
    async function (req, res, next) {
        try {
            const response = await payment_service.get_payments_by_service_account_id(req.params.id);
            res.send(response);
        }
        catch (err) {
            next(err);
        }
    });

router.post('/',
    validation_helper.validation_middleware('payment_request'),
    async function (req, res, next) {
        try {
            const response = await payment_service.make_payment_by_service_account_id(req.params.id, req.payment_request);
            res.send(response);
        }
        catch (err) {
            next(err);
        }
    });

module.exports = router;
