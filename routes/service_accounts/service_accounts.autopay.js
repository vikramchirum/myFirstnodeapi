const express = require('express');
const router = express.Router({ mergeParams: true });
const autopay_service = require('../../lib/services/autopay_service');
const validation_helper = require('../../lib/helpers/validation.helper');

router.get('/',
    async function (req, res, next) {
        try {
            const response = await autopay_service.get_by_service_account_id(req.params.id);
            if (response) {
                res.send(response);
            }
            else {
                res.sendStatus(404);
            }
        }
        catch (err) {
            next(err);
        }
    });

router.post('/',
    validation_helper.validation_middleware('autopay_request'),
    async function (req, res, next) {
        try {
            const response = await autopay_service.signup(req.params.id, req.autopay_request.pay_method_id);
            if (response) {
                res.send(response);
            }
            else {
                res.sendStatus(404);
            }
        }
        catch (err) {
            next(err);
        }
    });

router.delete('/',
    async function (req, res, next) {
        const response = await autopay_service.cancel(req.params.id);
        if (response) {
            res.send(response);
        }
        else {
            res.sendStatus(404);
        }
    });

module.exports = router;
