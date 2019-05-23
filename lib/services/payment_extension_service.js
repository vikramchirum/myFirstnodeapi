const external_api = require('../external_api');
const _ = require('lodash');

const payment_extension_service = {};

payment_extension_service.format_status_result = function (status_result) {
    return {
        Customer_Account_Id: status_result.EntityId,
        Disconnect_Letter_Info: payment_extension_service.format_disconnect_letter_info(status_result.DisconnectletterInfo),
        Past_Due: status_result.PastDue,
        Deposit_Balance: status_result.DepositBalance,
        Status: status_result.Status.replace('PASS', 'PAST').replace('APPROED', 'APPROVED'),
        Eligibility_Result: status_result.EligibilityResult
    };
};

payment_extension_service.format_disconnect_letter_info = function (dli) {
    if (dli) {
        return {
            Id: dli.LetterInfoId,
            Request_Date: dli.RequestDate,
            Disconnect_Notice_Sent_Date: dli.DisconnectNoticeSentDate,
            Disconnect_Action_Date: dli.DisconnectActionDate
        };
    }
    else {
        return null;
    }
};

payment_extension_service.get_by_service_account_id = async function (service_account_id) {
    try {
        let query = {
            serviceaccountid: service_account_id
        };
        let response = await external_api.search('/api/paymentextension/v1', query);
        let cleaned_response = external_api.clean_response(response);
        return payment_extension_service.format_status_result(cleaned_response);
    }
    catch (err) {
        throw err;
    }
};

payment_extension_service.request_payment_extension_by_service_account_id = async function (service_account_id, user_name, extend) {
    try {
        let extension_status = await payment_extension_service.get_by_service_account_id(service_account_id);
        if (extension_status && extension_status.Disconnect_Letter_Info && extension_status.Disconnect_Letter_Info.Disconnect_Action_Date) {
            let action_date = new Date(extension_status.Disconnect_Letter_Info.Disconnect_Action_Date);
            let default_date = new Date(action_date);
            default_date.setDate(action_date.getDate() + 7);
            let max_date = new Date(action_date);
            max_date.setDate(action_date.getDate() + 10);
            const request = {
                serviceaccountid: service_account_id,
                csrname: user_name
            };
            if (extend) {
                request.paymentExtensionDate = max_date.toISOString();
            }
            else {
                request.paymentExtensionDate = default_date.toISOString();
            }
            let response = await external_api.post('/api/paymentextension/v1', request);
            let cleaned_response = external_api.clean_response(response);
            return cleaned_response;
        }
        else {
            throw new Error('NO_DISCONNECT_LETTER');
        }
    }
    catch (err) {
        throw err;
    }
};

module.exports = payment_extension_service;
