const external_api = require('../external_api');

const invoice_service = {};

const format_invoice = function(invoice){
    return {
        Id: '' + invoice.Invoice_Id,
        Invoice_Date: invoice.Invoice_Date,
        Due_Date: invoice.Due_Date,
        Usage: invoice.Usage,
        Current_Charges: invoice.Current_Charges,
        Amount_Due: invoice.Amount_Due,
        Credit: invoice.Credit,
        Balance_Forward: invoice.Balance_Forward
    };
};

invoice_service.get_single_details = async function(service_account_id, invoice_id){
    try {
        let response = await external_api.get('/api/invoice/' + service_account_id + '/' + invoice_id + '/details');
        let result = external_api.clean_response(response);
        return result;
    }
    catch (err) {
        throw err;
    }
};

invoice_service.get_single = async function(service_account_id, invoice_id){
    try {
        let response = await external_api.get('/api/invoice/' + service_account_id + '/' + invoice_id);
        let result = external_api.clean_response(response);
        return format_invoice(result);
    }
    catch (err) {
        throw err;
    }
};

invoice_service.download_invoice = async function(invoice_id) {
    let path = `/api/documents/invoice/generate/${invoice_id}`;
    return getFileResponse(await external_api.get(path, true));
};

invoice_service.get_by_service_account_id = async function (id) {
    try {
        let response = await external_api.search('/api/invoice', {service_account_id: id});
        let result = external_api.clean_response(response);
        return result.map(format_invoice);
    }
    catch (err) {
        throw err;
    }
};

function getFileResponse(response)
{
    let bytes = response.body;
    let id = response.headers['content-disposition'].replace('inline; filename=', '');
    return {bytes: bytes, id: id};
}

module.exports = invoice_service;
