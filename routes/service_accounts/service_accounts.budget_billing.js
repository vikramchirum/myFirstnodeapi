const express = require('express');
const router = express.Router({ mergeParams: true });
const budget_billing_service = require('../../lib/services/budget_billing_service');
const validation_helper = require('../../lib/helpers/validation.helper');

router.get('/',
    async function (req, res, next) {
        try {
            const response = await budget_billing_service.get_by_service_account_id(req.params.id);
            res.send(response);
        }
        catch (err) {
            next(err);
        }
    });

router.get('/details',
    async function (req, res, next) {
        try {
            const response = await budget_billing_service.get_details_by_service_account_id(req.params.id);
            res.send(response);
        }
        catch (err) {
            next(err);
        }
    });

router.delete('/',
    async function (req, res, next) {
        try {
            const response = await budget_billing_service.cancel(req.params.id, req.user.sub);
            res.send(response);
        }
        catch (err) {
            next(err);
        }
    });

router.post('/',
    validation_helper.validation_middleware('budget_billing_sign_up_request'),
    async function (req, res, next) {
        try {
            const response = await budget_billing_service.sign_up(req.params.id, req.budget_billing_sign_up_request.Amount, req.user.sub);
            res.send(response);
        }
        catch (err) {
            next(err);
        }
    });


module.exports = router;
