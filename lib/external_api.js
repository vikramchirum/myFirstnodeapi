const http_client = require('gexa.http_client.basic_auth').http_client;
const logger = require('log-driver').logger;

const external_api = new http_client({
    base_url: process.env.EXTERNAL_API_URL,
    passphrase: process.env.EXTERNAL_API_PASSPHRASE,
    request_callback: function (info, err) {
        if (err) {
            logger.error(err);
        }
        else {
            logger.info(info);
        }
    }
});

module.exports = external_api;
