const mongo_options = {
    db: process.env.WINSTON_CONN_STRING,
    collection: process.env.WINSTON_COLLECTION
};
const json = require('morgan-json');
const winston = require('winston');
require('winston-mongodb');
winston.add(winston.transports.MongoDB, mongo_options);

let logger = {};

logger.format = json({
    message: ':method :url :status :res[content-length] :response-time',
    level: 'info',
    method: ':method',
    url: ':url',
    status: ':status',
    content_length: ':res[content-length]',
    response_time: ':response-time',
    http_version: ':http-version',
    referrer: ':referrer',
    remote_address: ':remote-addr',
    user_agent: ':user-agent'
});

logger.loggerstream = {
    write: function (message, encoding) {
        let log_item = JSON.parse(message);
        log_item.status = parseInt(log_item.status);
        log_item.response_time = parseFloat(log_item.response_time);
        logger.log(log_item);
    }
};

logger.log = function (obj) {
    winston.log(obj.level, obj.message, obj);
};

module.exports = logger;
