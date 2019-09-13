const external_api = require('../external_api');

let service_account_service = {};

service_account_service.get_by_id = async function (id) {
    try {
        let result = await await external_api.get('/api/service_accounts/' + id, false);
        return result;
    }
    catch (err) {
        throw err;
    }
};

service_account_service.search = async function (query) {
    try {
        let results = await external_api.search('/api/service_accounts', query);
        return results;
    }
    catch (err) {
        throw err;
    }
};

service_account_service.get_notes = async function (id, count) {
    try {
        let result = await external_api.get('/api/service_accounts/' + id + '/notes?maxRetRec=' + count, false);
        return result;
    }
    catch (err) {
        throw err;
    }
};

service_account_service.post_notes = async function (id, note_req) {
    try {
        const request = {
            Service_Account_Id: id,
            NoteType: "General",
            Note: note_req.Note,
            UserName: note_req.User,
            Followup_Ind: note_req.Followup_Ind
        };

        let result = await external_api.post('/api/Notes/CSPNote', request);
        return result;
    }
    catch (err) {
        throw err;
    }
};

service_account_service.get_usage_history = async function (id) {
    try {
        let results = await external_api.get(`/api/service_accounts/${id}/usage_history`);
        return results;
    }
    catch (err) {
        throw err;
    }
};

service_account_service.get_service_orders = async function (id) {
    try {
        let results = await external_api.get(`/api/service_accounts/${id}/Service_Orders`);
        return results;
    }
    catch (err) {
        throw err;
    }
};

service_account_service.get_meter_read_details = async function(service_account_id, count = 50) {
    try {
        let path = `/api/invoice/InvoiceMeterReadDetails`;
        let body = {
            'CSPId': service_account_id,
            'count': count
        };

        let result = await external_api.post(path, body);
        return result;
    }
    catch (err) {
        throw err;
    }
};

service_account_service.get_waivers = async function (id) {
    try {
        let result = await external_api.get('/api/service_accounts/' + id + '/standard_waivers');
        return result;
    }
    catch (err) {
        throw err;
    }
};

service_account_service.request_waiver = async function (id, waiver_request) {
    try {
        let result = await external_api.post('/api/service_accounts/' + id + '/standard_waivers', waiver_request);
        return result;
    }
    catch (err) {
        throw err;
    }
};

service_account_service.disconnect = async function(id, disconnect_request) {
    try {
        let result = await external_api.put(`/api/service_accounts/${id}/disconnect`, disconnect_request);
        return external_api.clean_response(result);
    }
    catch (err) {
        throw  err;
    }
};

service_account_service.update = async function (id, update_def) {
    try {
        let original = await service_account_service.get_by_id(id);
        if (!original) {
            return null;
        }

        let update_request = {
            Mailing_Address: {

                Line1: update_def.Mailing_Address.Line_1,
                Line2: update_def.Mailing_Address.Line_2,
                City: update_def.Mailing_Address.City,
                State: update_def.Mailing_Address.State,
                Zip: update_def.Mailing_Address.Zip,
                Zip_4: update_def.Mailing_Address.Zip_4,
            },
            Id: id,
            Customer_Account_Id: original.Customer_Account_Id
        };

        let response = await external_api.put('/api/service_accounts', update_request);
        let cleaned_response = external_api.clean_response(response);
        return cleaned_response;
    }
    catch (err) {
        throw err;
    }
};

module.exports = service_account_service;
