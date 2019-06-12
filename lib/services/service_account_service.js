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

service_account_service.get_suspension_info = async function (id) {
    try {
        let results = await external_api.search(`/api/service_accounts/${id}/suspended`, query);
        return external_api.clean_response(results);
    }
    catch (err) {
        throw err;
    }
};

service_account_service.get_voided_rejected_info = async function (id) {
    try {
        let results = await external_api.search(`/api/service_accounts/${id}/voided_rejected`, query);
        return external_api.clean_response(results);
    }
    catch (err) {
        throw err;
    }
};

module.exports = service_account_service;
