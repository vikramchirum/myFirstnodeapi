const external_api = require('../external_api');
let notes_service = {};

notes_service.get_service_account_notes = async function (id, count) {
    try {
        let result = await external_api.get('/api/service_accounts/' + id + '/notes?maxRetRec=' + count, false);
        return result;
    }
    catch (err) {
        throw err;
    }
};

notes_service.post_service_account_notes = async function (id, note_req) {
    try {
        const request = {
            Service_Account_Id: id,
            NoteType: "general",
            Note: note_req.Note,
            UserName: "Kalpana", //TODO
            Followup_Ind: note_req.Followup_Ind
        };

        let result = await external_api.post('/api/Notes/CSPNote', request);
        return result;
    }
    catch (err) {
        throw err;
    }
};

notes_service.get_customer_account_notes = async function (id, count = 50) {
    try {
        let result = await external_api.get(`/api/customer_accounts/${id}/notes/${count}`, false);
        return result;
    }
    catch (err) {
        throw err;
    }
};

notes_service.post_customer_account_notes = async function (id, note_req) {
    try {
        let request = {
            Note_Type: note_req.Note_Type,
            Note: note_req.Note,
            Added_By: note_req.User,
            Followup_Required_Date: note_req.Followup_Required_Date,
            Followup_Required: note_req.Followup_Required
        };
        let result = await external_api.post(`/api/customer_accounts/${id}/notes/`, request);
        return result;
    }
    catch (err) {
        throw err;
    }
};

module.exports = notes_service;