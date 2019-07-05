const external_api = require('../external_api');
const service_account_service = require('./service_account_service');
const pay_method_service = require('./pay_method_service');
const custom_error = require('../custom_error');
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
        if (service_account) {
            if (service_account.AutoPayConfigId) {
                let query = {
                    autopaymentconfigid: service_account.AutoPayConfigId
                };
                let response = await external_api.search('/api/autopaymentconfigs', query);
                if (response && response.length && response.length > 0) {
                    return autopay_service.format_autopay_detail(cleaned_response[0]);
                }
                else {
                    throw new custom_error('No autopay details found', 404);
                }
            }
            else {
                throw new custom_error('No autopay details found', 404);
            }
        }
        else {
            throw new custom_error('Service account not found', 404);
        }
    }
    catch (err) {
        throw err;
    }
};

autopay_service.signup = async function (service_account_id, pay_method_id) {
    try {
        let service_account = await service_account_service.get_by_id(service_account_id);
        if (service_account) {
            //Confirm that this customer owns the pay method id sent, will error if not
            let pay_method = await pay_method_service.find_by_id_using_customer_id(service_account.Customer_Account_Id, pay_method_id);
            //If the service account is already on autopay then we will update it
            if (service_account.AutoPayConfigId) {
                if (service_account.PayMethodId == pay_method_id) {
                    throw new custom_error(['Already signed up for autopay on this paymethod'], 400);
                }
                else {
                    let autopay_update = {
                        APCId: service_account.AutoPayConfigId,
                        PayMethodId: pay_method_id
                    };
                    let response = await external_api.put('/api/autopaymentconfigs', autopay_update);
                    return autopay_service.format_autopay_detail(response);
                }
            }
            //Otherwise we will create one
            else {
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
                return autopay_service.format_autopay_detail(response);
            }
        }
        else {
            throw new custom_error('Service Account not found', 404);
        }
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
                return response;
            }
            else {
                throw new custom_error(['Service Account Id: ' + service_account_id + ' is not signed up for autopay so it cannot be canceled'], 400);
            }
        }
        else {
            throw new custom_error('Service Account not found', 404);
        }
    }
    catch (err) {
        throw err;
    }
};

module.exports = autopay_service;
