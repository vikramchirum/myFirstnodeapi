const external_api = require('../external_api');
const _ = require('lodash');

let payment_service = {};

payment_service.format_payment_response = function (payment_response) {
    return {
        Amount: payment_response.AuthorizationAmount,
        Confirmation_Number: payment_response.PaymentTransactionId + '-' + payment_response.AuthorizationCode,
        Approval_Status: payment_response.PaymentVendorResponseDescription,
        Settlement_Status: payment_response.SettlementStatus
    };
};

payment_service.format_payment_detail = function (payment_detail) {
    return {
        Date: payment_detail.PaymentDate,
        Amount: payment_detail.PaymentAmount,
        Status: payment_detail.PaymentStatus,
        Method: payment_detail.PaymentMethod,
        Account: payment_detail.PaymentAccount
    };
};

payment_service.make_payment_by_service_account_id = async function (service_account_id, payment_request) {
    try {
        const ext_payment_request = {
            AuthorizationAmount: payment_request.Amount,
            ServiceAccountId: service_account_id,
            Source: 'NodeApi',
            Paymethod: {}
        };
        if (payment_request.One_Time_Token) {
            ext_payment_request.Paymethod.Token = payment_request.One_Time_Token;
        }
        if (payment_request.Pay_Method_Id) {
            ext_payment_request.Paymethod.PaymethodId = payment_request.Pay_Method_Id;
        }
        let response = await external_api.post('/api/payments?convertPayMethod=false', ext_payment_request);
        let cleaned_response = external_api.clean_response(response);
        return payment_service.format_payment_response(cleaned_response);
    }
    catch (err) {
        throw err;
    }
};

payment_service.get_payments_by_service_account_id = async function (service_account_id) {
    try {
        let response = await external_api.search('/api/payments', {service_account_id: service_account_id});
        let cleaned_response = external_api.clean_response(response);
        return cleaned_response.map(payment_service.format_payment_detail);
    }
    catch (err) {
        throw err;
    }
};

module.exports = payment_service;
