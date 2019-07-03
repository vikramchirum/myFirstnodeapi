const external_api = require('../external_api');
const customer_account_service = require('./customer_account_service');
const custom_error = require('../custom_error');
const _ = require('lodash');

let pay_method_service = {};

pay_method_service.format_pay_method = function (pay_method) {
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

pay_method_service.format_pay_methods = function (pay_method_list) {
    const formatted_pay_methods = pay_method_list.map(pay_method_service.format_pay_method);
    return formatted_pay_methods;
};

pay_method_service.get_by_customer_account_id = async function (customer_account_id, active) {
    try {
        let query = {
            businessUnit: 'Gexa',
            clientApplicationName: 'Residential Portal',
            userKey: customer_account_id + '-1'
        };
        if (active != null) {
            query.isActive = active;
        }
        let response = await external_api.search('/api/paymethods', query);
        let cleaned_response = external_api.clean_response(response);
        let stored_payments = _.filter(cleaned_response, function (paymethod) {
            return !paymethod.IsOneTimeUse;
        });
        return pay_method_service.format_pay_methods(stored_payments);
    }
    catch (err) {
        throw err;
    }
};

pay_method_service.add = async function (customer_account_id, one_time_token, user) {
    try {
        let customer = await customer_account_service.get_by_id(customer_account_id);
        if (customer) {
            let payload = {
                AccountHolder: 'TEST PERSON',
                AccountNumber: '1111',
                CreditCardType: 'Visa',
                PaymethodName: 'Visa{ 1111 }',
                PaymethodType: 'CreditCard',
                Paymethod_Customer: {
                    Id: customer_account_id + '-1',
                    FirstName: customer.First_Name,
                    LastName: customer.Last_Name
                },
                Token: one_time_token,
                UserName: user
            };
            let response = await external_api.post('/api/paymethods', payload);
            let cleaned_response = external_api.clean_response(response);
            return pay_method_service.format_pay_method(cleaned_response);
        }
        else {
            throw new custom_error('Customer Account not found', 404);
        }
    }
    catch (err) {
        throw err;
    }
};

pay_method_service.find_by_id_using_customer_id = async function (customer_account_id, pay_method_id) {
    try {
        pay_method_id = parseInt(pay_method_id);
        let pay_methods = await pay_method_service.get_by_customer_account_id(customer_account_id, true);
        if (pay_methods && pay_methods.length > 0) {
            let found_pay_method = _.find(pay_methods, function (pay_method) {
                return pay_method.Id === pay_method_id;
            });
            if (found_pay_method) {
                return found_pay_method;
            }
            else {
                throw new custom_error('Pay method id: ' + pay_method_id + ' does not belong to customer with account id: ' + customer_account_id, 401);
            }
        }
        else {
            throw new custom_error('Pay method id: ' + pay_method_id + ' does not belong to customer with account id: ' + customer_account_id, 401);
        }
    }
    catch (err) {
        throw err;
    }
};

pay_method_service.delete = async function (customer_account_id, pay_method_id, user) {
    try {
        let pay_method = await pay_method_service.find_by_id_using_customer_id(customer_account_id, pay_method_id);
        if (pay_method) {
            let payload = {
                PaymethodId: pay_method_id,
                UserName: user
            };
            let response = await external_api.put('/api/paymethods/deactivate', payload);
            let cleaned_response = external_api.clean_response(response);
            return pay_method_service.format_pay_method(cleaned_response);
        }
        else {
            throw new custom_error('Pay method id: ' + pay_method_id + ' does not belong to customer with account id: ' + customer_account_id, 401);
        }
    }
    catch (err) {
        throw err;
    }
};

pay_method_service.patch = async function (customer_account_id, pay_method_id, update, user) {
    try {
        let pay_method = await pay_method_service.find_by_id_using_customer_id(customer_account_id, pay_method_id);
        if (pay_method) {
            if (pay_method.Type === 'CreditCard') {
                let payload = {
                    PaymethodId: pay_method_id,
                    UserName: user
                };
                Object.assign(payload, update);
                let response = await external_api.put('/api/paymethods', payload);
                let cleaned_response = external_api.clean_response(response);
                return pay_method_service.format_pay_method(cleaned_response);
            }
            else {
                throw new custom_error(['Cannot update the CVV and expiration of an eCheck pay method'], 400);
            }
        }
        else {
            throw new custom_error('Pay method id: ' + pay_method_id + ' does not belong to customer with account id: ' + customer_account_id, 401);
        }
    }
    catch (err) {
        throw err;
    }
};

module.exports = pay_method_service;
