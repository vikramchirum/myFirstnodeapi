const express = require('express');
const router = express.Router();
const jwt_authorization = require("../lib/jwt_authorization");
const validation_helper = require('../lib/helpers/validation.helper');
const customer_account_service = require('../lib/services/customer_account_service');
const payment_service = require('../lib/services/payment_service');

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
        else{
            throw new Error('Issuer for token is not recognized');
        }
    }
    else {
        throw new Error('User token not found')
    }
};

const format_pay_method = function (pay_method) {
    let result = {
        Id: pay_method.PayMethodId,
        Active: pay_method.IsActive,
        Type: pay_method.CreditCard ? 'CreditCard' : pay_method.BankAccount ? 'eCheck' : 'Unknown'
    };

    if (result.Type === 'CreditCard') {
        result.CreditCard = pay_method.CreditCard;
        delete result.CreditCard.CardVerificationValue;
    }
    else if (result.Type === 'eCheck') {
        result.BankAccount = pay_method.BankAccount;
    }

    return result;
};

const format_pay_methods = function (pay_method_list) {
    const formatted_pay_methods = pay_method_list.map(format_pay_method);
    return formatted_pay_methods;
};

router.get('/:id/pay_methods',
    jwt_authorization.verify_claims_from_request_property('Customer_Account_Id', 'params.id'),
    async function (req, res, next) {
        try {
            let result = await payment_service.get_by_customer_account_id(req.params.id);
            res.send(format_pay_methods(result));
        }
        catch (err) {
            next(err);
        }
    });

router.get('/:id',
    jwt_authorization.verify_claims_from_request_property('Customer_Account_Id', 'params.id'),
    async function (req, res, next) {
        try {
            let customer_account = await customer_account_service.get_by_id(req.params.id);
            if (customer_account) {
                res.send(format_customer_response(req.user, customer_account));
            }
            else{
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
            else{
                res.sendStatus(404);
            }
        }
        catch (err) {
            next(err);
        }
    });

module.exports = router;
