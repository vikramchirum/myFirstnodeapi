const external_api = require('../external_api');

let suspension_letter_service = {};

suspension_letter_service.get_disconnect_letter_info = async function (id) {
    try {
        let result = await external_api.get('/api/customer_correspondence/disconnectletterinfo?service_account_id=' + id, false);
        return result;
    }
    catch (err) {
        throw err;
    }
};

module.exports = suspension_letter_service;