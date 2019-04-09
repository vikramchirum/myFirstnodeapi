process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; //TODO: remove this later

const external_api = require("../external_api");
const gems_service = {};



gems_service.post_fuzzysearch_request_to_gems = async function (fuzzysearch_request) {
    try {
        let response = await external_api.post('/api/customer_accounts/FuzzySearch', fuzzysearch_request);
        return response.body;
    }
    catch (err) {
        throw err;
    }
};



module.exports = gems_service;
