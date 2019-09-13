const external_api = require('../external_api');
const _ = require('lodash');
const custom_error = require('../custom_error');

let support_service = {};

support_service.contact_us = async function (contact_us_request) {
    try {
        let response = await external_api.post('/api/messagecenter/contactus', contact_us_request);
        if (response && response.Is_Success){
            return {Is_Success: true};
        }
        else{
            throw new custom_error(response.ErrorMessage, 400);
        }
    }
    catch (err) {
        throw err;
    }
};

module.exports = support_service;
