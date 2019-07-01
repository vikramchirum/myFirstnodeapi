const express = require('express');
const router = express.Router({mergeParams: true});
const payment_service = require('../../lib/services/payment_service');
const jwt_authorization = require("../../lib/jwt_authorization");

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

router.get('/',
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

module.exports = router;