const external_api = require('../external_api');
const _ = require('lodash');

let budget_billing_service = {};

budget_billing_service.format_budget_billing_details = function (response) {
    delete response.Service_Account_Id;
    return response;
};

budget_billing_service.get_by_service_account_id = async function (service_account_id) {
    try {
        let response = await external_api.get('/api/budget_billing/' + service_account_id);
        return response;
    }
    catch (err) {
        throw err;
    }
};

budget_billing_service.get_details_by_service_account_id = async function (service_account_id) {
    try {
        let response = await external_api.get('/api/budget_billing/' + service_account_id + '/details');
        return this.format_budget_billing_details(response);
    }
    catch (err) {
        throw err;
    }
};

budget_billing_service.sign_up = async function (service_account_id, amount, user) {
    try {
        let estimate = await budget_billing_service.get_details_by_service_account_id(service_account_id);
        let post_data = {
            Amount: amount,
            DefaultAmount: estimate.Amount,
            Service_Account_Id: service_account_id,
            User_Name: user
        };
        let response = await external_api.post('/api/budget_billing/' + service_account_id + '/create', post_data);
        return response;
    }
    catch (err) {
        throw err;
    }
};

budget_billing_service.cancel = async function (service_account_id, user) {
    try {
        let post_data = {
            Service_Account_Id: service_account_id,
            User_Name: user
        };
        let response = await external_api.put('/api/budget_billing/' + service_account_id + '/cancel', post_data);
        return response;
    }
    catch (err) {
        throw err;
    }
};

module.exports = budget_billing_service;