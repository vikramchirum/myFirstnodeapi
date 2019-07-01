const legacy_db = require('../helpers/db.legacy.helper');
const notification_options = legacy_db.get('Notification_Options');

let notification_option_service = {};

notification_option_service.search = async function (query) {
    return await notification_options.find(query);
};

notification_option_service.setup = async function (customer_account_id, create_request) {

    let query = {
        'Account_Info.Account_Type': "GEMS_Residential_Customer_Account",
        'Account_Info.Account_Number': customer_account_id,
        Type: create_request.Type
    };
    const existing = await notification_option_service.search(query);
    if (existing && existing.length > 0) {
        let update = {
            $set: {
                Status: 'Active',
                Preferred_Contact_Method: create_request.Preferred_Contact_Method,
                Paperless: create_request.Paperless
            }
        };
        if (create_request.Email) {
            update.$set.Email = create_request.Email;
        }
        if (create_request.Phone_Number) {
            update.$set.Phone_Number = create_request.Phone_Number;
        }
        return await notification_options.findOneAndUpdate(query, update);
    }
    else {
        let base_request = {
            Account_Info: {
                Account_Type: 'GEMS_Residential_Customer_Account',
                Account_Number: customer_account_id
            },
            Status: 'Active',
            Date_Created: new Date(),
            Date_Last_Modified: new Date()
        };

        Object.assign(base_request, create_request);
        return await notification_options.insert(base_request);
    }
};

notification_option_service.cancel = async function (customer_account_id, type) {
    let query = {
        'Account_Info.Account_Type': "GEMS_Residential_Customer_Account",
        'Account_Info.Account_Number': customer_account_id,
        Type: type
    };
    return await notification_options.findOneAndUpdate(query, { $set: { Status: 'Canceled' } });
};

module.exports = notification_option_service;
