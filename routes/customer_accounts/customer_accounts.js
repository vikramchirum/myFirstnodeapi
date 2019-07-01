const express = require('express');
const router = express.Router();
const validation_helper = require('../../lib/helpers/validation.helper');
const customer_account_service = require('../../lib/services/customer_account_service');
const jwt_authorization = require("../../lib/jwt_authorization");
const notes_service = require('../../lib/services/notes_service');

router.use(jwt_authorization.middleware({
    audience: process.env.AUDIENCE,
    issuer: [process.env.CUSTOMER_ISSUER, process.env.INTERNAL_ISSUER]
}));

const format_customer_response = function (user, customer_account) {
    if (user) {
        if (user.iss === process.env.INTERNAL_ISSUER) {
            //Remove SSN
            delete customer_account.Social_Security_Number;
            return customer_account;
        }
        else if (user.iss === 'servicing_api') {
            delete customer_account.Social_Security_Number;
            delete customer_account.Masked_Social_Security_Number;
            delete customer_account.AlternateID;
            delete customer_account.Drivers_License;
            return customer_account;
        }
        else {
            throw new Error('Issuer for token is not recognized');
        }
    }
    else {
        throw new Error('User token not found')
    }
};

router.get('/:id',
    jwt_authorization.verify_claims_from_request_property('Customer_Account_Id', 'params.id'),
    async function (req, res, next) {
        try {
            let customer_account = await customer_account_service.get_by_id(req.params.id);
            if (customer_account) {
                res.send(format_customer_response(req.user, customer_account));
            }
            else {
                res.sendStatus(404);
            }
        }
        catch (err) {
            next(err);
        }
    });

router.patch('/:id',
    jwt_authorization.verify_claims_from_request_property('Customer_Account_Id', 'params.id'),
    validation_helper.validation_middleware('customer_account_patch'),
    async function (req, res, next) {
        try {
            let updated_customer_account = await customer_account_service.update(req.params.id, req.customer_account_patch);
            if (updated_customer_account) {
                res.send(format_customer_response(req.user, updated_customer_account));
            }
            else {
                res.sendStatus(404);
            }
        }
        catch (err) {
            next(err);
        }
    });

router.post('/:id/notes',
    jwt_authorization.verify_claims_from_request_property('Customer_Account_Id', 'params.id'),
    validation_helper.validation_middleware('customer_account_add_note_request'),
    async function (req, res, next) {
        try {

            var note_request = req.customer_account_add_note_request;
            note_request.User = req.user.sub;

            var response = await notes_service.post_customer_account_notes(req.params.id, note_request);
            res.send(response);
        }
        catch (err) {
            next(err);
        }
    });

router.get('/:id/notes/:count?',
    jwt_authorization.verify_claims_from_request_property('Customer_Account_Id', 'params.id'),
    async function (req, res, next) {
        try {

            if (!req.params.count || req.params.count === '0') {
                req.params.count = 20;
            }

            var response = await notes_service.get_customer_account_notes(req.params.id, req.params.count);
            res.send(response);
        }
        catch (err) {
            next(err);
        }
    });

router.use('/:id/notification_options', require('./customer_accounts.notification_options'));

router.use('/:id/pay_methods', require('./customer_accounts.pay_methods'));

router.post('/fuzzy_search',
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
