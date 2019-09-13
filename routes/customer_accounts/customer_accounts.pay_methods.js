const express = require('express');
const router = express.Router({ mergeParams: true });
const pay_method_service = require('../../lib/services/pay_method_service');
const validation_helper = require('../../lib/helpers/validation.helper');

router.get('/',
    async function (req, res, next) {
        try {
            let result = await pay_method_service.get_by_customer_account_id(req.params.id, req.query.active);
            res.send(result);
        }
        catch (err) {
            next(err);
        }
    });

router.post('/',
    validation_helper.validation_middleware('pay_method_create_request'),
    async function (req, res, next) {
        try {
            let result = await pay_method_service.add(req.params.id, req.pay_method_create_request.Token, req.user.sub);
            res.send(result);
        }
        catch (err) {
            next(err);
        }
    });

router.delete('/:pay_method_id',
    async function (req, res, next) {
        try {
            let result = await pay_method_service.delete(req.params.id, req.params.pay_method_id, req.user.sub);
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
    });

router.patch('/:pay_method_id',
    validation_helper.validation_middleware('pay_method_update_request'),
    async function (req, res, next) {
        try {
            let result = await pay_method_service.patch(req.params.id, req.params.pay_method_id, req.pay_method_update_request, req.user.sub);
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
    });

module.exports = router;