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

service_account_service.get_notes = async function (id, maxRetRec) {
    try {
        let result = await await external_api.get('/api/service_accounts/' + id + '/notes?maxRetRec=' + maxRetRec, false);
        return external_api.clean_response(result);
    }
    catch (err) {
        throw err;
    }
};

module.exports = service_account_service;
