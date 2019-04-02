const monk = require('monk');
const logger = require('log-driver')({level: 'info'});

let db;
if (process.env.MONGO_AUTH_SOURCE) {
    db = monk(process.env.MONGO_CONN_STRING, {authSource: process.env.MONGO_AUTH_SOURCE});
}
else {
    db = monk(process.env.MONGO_CONN_STRING);
}

db
    .then(function () {
        logger.info('Successfully connected to mongodb');
    })
    .catch(function (err) {
        logger.error('Connection failed to mongodb');
    });

module.exports = db;
