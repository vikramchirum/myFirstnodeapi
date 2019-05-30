const external_api = require('../external_api');
let cache_service = {};

cache_service.Save = async function(cache_req){
    try {
        let response = await external_api.post('/api/Service_Account_Cache', cache_req);
        let result = external_api.clean_response(response);
        return result;
    }
    catch (err) {
        throw err;
    }
};

cache_service.get_by_phone = async function(phone_number){
    try {
        let response = await external_api.get(`/api/Service_Account_Cache/${phone_number}`);
        let result = external_api.clean_response(response);
        return result;
    }
    catch (err) {
        throw err;
    }
};

module.exports = cache_service;