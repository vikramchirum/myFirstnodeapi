const external_api = require('../external_api');

let customer_account_service = {};

customer_account_service.get_by_id = async function (id) {
    try {
        let result = await external_api.get('/api/customer_accounts/' + id, false);
        return external_api.clean_response(result);
    }
    catch (err) {
        throw err;
    }
};

customer_account_service.update = async function (id, update_def) {
    try {
        let original = await customer_account_service.get_by_id(id);
        if (original) {
            if (update_def.Email) {
                original.Email = update_def.Email;
            }
            if (update_def.Primary_Phone_Number) {
                original.Primary_Phone = update_def.Primary_Phone_Number;
            }
            let response = await external_api.put('/api/customer_accounts/', original);
            let cleaned_response = external_api.clean_response(response);
            return cleaned_response;
        }
        else {
            return null;
        }
    }
    catch (err) {
        throw err;
    }
};

module.exports = customer_account_service;
