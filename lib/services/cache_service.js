const external_api = require('../external_api');
let cache_service = {};

cache_service.save_auth = async function(cache_req){
    try {
        let response = await external_api.post('/api/Customer_Cache', cache_req);
        return response;
    }
    catch (err) {
        throw err;
    }
};

cache_service.get_by_phone = async function(phone_number){
    try {
        let response = await external_api.get(`/api/Customer_Cache/${phone_number}`);
        return response;
    }
    catch (err) {
        throw err;
    }
};

module.exports = cache_service;