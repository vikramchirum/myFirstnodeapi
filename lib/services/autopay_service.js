const external_api = require('../external_api');
const service_account_service = require('./service_account_service');
const _ = require('lodash');

let autopay_service = {};

autopay_service.format_autopay_detail = function (autopay_response) {
    return {
        Id: autopay_response.Id,
        StartDate: autopay_response.StartDate,
        StopDate: autopay_response.StopDate,
        PayMethodId: autopay_response.PayMethodId
    };
};

autopay_service.get_by_service_account_id = async function (service_account_id) {
    try {
        let service_account = await service_account_service.get_by_id(service_account_id);
        if (service_account && service_account.AutoPayConfigId) {
            let query = {
                autopaymentconfigid: service_account.AutoPayConfigId
            };
            let response = await external_api.search('/api/autopaymentconfigs', query);
            let cleaned_response = external_api.clean_response(response);
            if (cleaned_response && cleaned_response.length && cleaned_response.length > 0) {
                return autopay_service.format_autopay_detail(cleaned_response[0]);
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }
    catch (err) {
        throw err;
    }
};

autopay_service.signup = async function (service_account_id, pay_method_id) {
    try {
        const autopay_request = {
            PayMethodId: pay_method_id,
            ServiceAccountModel: {
                AccountTypeName: 'ContractServicePoint',
                BillingSystem: 'GEMS',
                BusinessUnit: 'GEXA',
                ServiceAccountId: service_account_id
            }
        };
        let response = await external_api.post('/api/autopaymentconfigs', autopay_request);
        let cleaned_response = external_api.clean_response(response);
        return autopay_service.format_autopay_detail(cleaned_response);
    }
    catch (err) {
        throw err;
    }
};

autopay_service.cancel = async function (service_account_id) {
    try {
        let service_account = await service_account_service.get_by_id(service_account_id);
        if (service_account) {
            if (service_account.AutoPayConfigId) {
                let response = await external_api.delete('/api/autopaymentconfigs', { autopayconfigid: service_account.AutoPayConfigId });
                let cleaned_response = external_api.clean_response(response);
                return cleaned_response;
            }
            else {
                return false;
            }
        }
        else {
            return null;
        }
    }
    catch (err) {
        throw err;
    }
};

module.exports = autopay_service;
