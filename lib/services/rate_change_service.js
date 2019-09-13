const external_api = require('../external_api');
const _ = require('lodash');

let rate_change_service = {};

rate_change_service.get_by_service_account_id = async function (service_account_id) {
    try {
        let response = await external_api.get('/api/renewals/' + service_account_id);
        return response;
    }
    catch (err) {
        throw err;
    }
};

rate_change_service.get_details_by_service_account_id = async function (service_account_id) {
    try {
        let response = await external_api.get('/api/renewals/' + service_account_id + '/details');
        return response;
    }
    catch (err) {
        throw err;
    }
};

module.exports = rate_change_service;
