const express = require('express');
const router = express.Router({ mergeParams: true });
const validation_helper = require('../../lib/helpers/validation.helper');
const customer_account_service = require('../../lib/services/customer_account_service');
const service_account_service = require('../../lib/services/service_account_service');

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

router.get('/',
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

router.patch('/',
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

router.use('/notes', require('./customer_accounts.notes'));

router.use('/notification_options', require('./customer_accounts.notification_options'));

router.use('/pay_methods', require('./customer_accounts.pay_methods'));

router.get('/service_accounts',
    async function (req, res, next) {
        try {
            let result = await service_account_service.search({Customer_Account_Id: req.params.id});
            res.send(result);
        }
        catch (err) {
            next(err);
        }
    });

module.exports = router;
