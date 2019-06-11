const external_api = require('../external_api');

let customer_correspondence_service = {};

customer_correspondence_service.get_disconnect_letter_info = async function (id) {
    try {
        let result = await external_api.get('/api/customer_correspondence/disconnectletterinfo?service_account_id=' + id, false);
        return external_api.clean_response(result);
    }
    catch (err) {
        throw err;
    }
};

module.exports = customer_correspondence_service;