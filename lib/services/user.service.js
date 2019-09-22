const external_api = require('../external_api');
const custom_error = require('../custom_error');

let user_service = {};

user_service.get_user_name = async function (get_user_name_request) {
    try {

        let service_account_id = get_user_name_request.Service_Account_Id;
        let email = get_user_name_request.Email;
        let result = null;

        if(service_account_id && email) {
            result = await external_api.get(`/api/user?serviceAccountId=${service_account_id}&emailAddress=${email}`, false);
        } else if (service_account_id) {
            result = await external_api.get(`/api/user?serviceAccountId=${service_account_id}`, false);
        } else if(email) {
            result = await external_api.get(`/api/user?emailAddress=${email}`, false);
        }

        if(result &&  result.length) {
            return result.map(x => {
                return {
                    User_Name: x.UserName,
                    Email: x.Email,
                    Account_Status: x.AccountLocked ? 'Locked' : 'Active'
                }
            });
        } else {
            throw new custom_error(`No User found.`, 404);
        }
    }
    catch (err) {
        throw err;
    }
};

user_service.get_primary_user_account = async function (service_account_id) {
    try {
        let result = await external_api.get(`/api/user/GetPrimaryBySAID?serviceAccountId=${service_account_id}`, false);
        if (result) {
            return {
                User_Name: result.UserName,
                Email: result.Email,
                Account_Status: result.AccountLocked ? 'Locked' : 'Active'
            }
        } else {
            throw new custom_error(`No User found.`, 404);
        }
    }
    catch (err) {
        throw err;
    }
};

user_service.email_user_name = async function (email_user_name_request) {
    try {

        let request = {};
        if (email_user_name_request.Email) {
            request.EmailAddress = email_user_name_request.Email;
        }
        if (email_user_name_request.Service_Account_Id) {
            request.ServiceAccountId = email_user_name_request.Service_Account_Id;
        }

        return await external_api.put(`/api/user/requestUsernameEmail`, request);
    }
    catch (err) {
        throw err;
    }
};

user_service.send_reset_password_email = async function(user_name) {
    try {
        let request = {};
        return await external_api.put(`/api/user/RequestPasswordResetEmail?username=${user_name}`, request);
    } catch (err) {
        throw err;
    }
}

user_service.unlock_user_account = async function (user_name) {
    try {
        let request = {};
        return await external_api.put(`/api/user/unlockUser?username=${user_name}`, request);
    }
    catch (err) {
        throw err;
    }
};

module.exports = user_service;