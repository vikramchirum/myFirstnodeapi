const external_api = require('../external_api');

let service_account_service = {};

service_account_service.get_by_id = async function (id) {
    try {
        let result = await await external_api.get('/api/service_accounts/' + id, false);
        return external_api.clean_response(result);
    }
    catch (err) {
        throw err;
    }
};

service_account_service.search = async function (query) {
    try {
        let results = await external_api.search('/api/service_accounts', query);
        return external_api.clean_response(results);
    }
    catch (err) {
        throw err;
    }
};

service_account_service.get_notes = async function (id, count) {
    try {
        let result = await external_api.get('/api/service_accounts/' + id + '/notes?maxRetRec=' + count, false);
        return external_api.clean_response(result);
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
        return external_api.clean_response(result);
    }
    catch (err) {
        throw err;
    }
};

service_account_service.get_usage_history = async function (id) {
    try {
        let results = await external_api.get(`/api/service_accounts/${id}/usage_history`);
        return external_api.clean_response(results);
    }
    catch (err) {
        throw err;
    }
};

service_account_service.get_service_orders = async function (id) {
    try {
        let results = await external_api.get(`/api/service_accounts/${id}/Service_Orders`);
        return external_api.clean_response(results);
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
        return external_api.clean_response(result);
    }
    catch (err) {
        throw err;
    }
};

service_account_service.get_standard_waivers = async function (id) {
    try {
        let result = await external_api.get('/api/service_accounts/' + id + '/standard_waivers');
        return external_api.clean_response(result);
    }
    catch (err) {
        throw err;
    }
};

service_account_service.request_waiver = async function (id, waiver_request) {
    try {
        let result = await external_api.post('/api/service_accounts/' + id + '/standard_waivers', waiver_request);
        return external_api.clean_response(result);
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

module.exports = service_account_service;
