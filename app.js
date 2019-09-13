require('dotenv').config();
const package = require('./package');

const express = require('express');

const Sentry = require('@sentry/node');
Sentry.init({
    dsn: 'https://794935177d3a42d7aad3bbdfc9d964fe@sentry.io/1725905',
    environment: process.env.ENV,
    release: package.name + '@' + package.version
});

const bodyParser = require('body-parser');
const morgan = require('morgan');
const logger = require('log-driver')({ level: 'info' });
const custom_error = require('./lib/custom_error');
const http_status_error = require('gexa.http_client.basic_auth').http_status_error;
//const logger = require('./lib/logger');

logger.info({
    message: 'Server Started',
    level: 'info'
});

let swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./specs/swagger.json');

let app = express();

app.use(Sentry.Handlers.requestHandler({
    user: ['sub', 'aud']
}));

app.use(morgan('combined'));
//app.use(morgan(logger.format, { stream: logger.loggerstream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const get_base_url = function (req) {
    return process.env.SCHEME + '://' + req.get('host') + '/api';
};

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});

app.use('/docs/swagger', function (req, res) {
    swaggerDocument.servers[0].url = get_base_url(req);
    res.send(swaggerDocument)
});

const api = require('./routes/api');
app.use('/api', api);

app.use('/',
    swaggerUi.serve,
    function (req, res) {
        swaggerDocument.servers[0].url = get_base_url(req);
        swaggerUi.setup(swaggerDocument)(req, res);
    },
    swaggerUi.setup(swaggerDocument)
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(Sentry.Handlers.errorHandler());

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development

    if (err.name === 'UnauthorizedError') {
        res.status(err.status).send(err.message);
    }
    else if (err instanceof http_status_error) {
        res.status(err.status).send(err.errors);
    }
    else if (err instanceof custom_error) {
        res.status(err.status).send(err.errors);
    }
    else if (err.status && err.status < 500 && err.message) {
        res.status(err.status).send(err.message);
    }
    else {

        logger.log({
            message: err.message,
            stack: err.stack,
            error: err,
            level: 'error',
            request_headers: req.headers,
            request_url: req.url,
            request_params: req.params,
            request_query: req.query
        });

        if (err.name === 'MongoError' && err.message.includes('duplicate')) {
            res.status(409);
            res.send({ Messsage: err.message });
        }
        else {
            res.status(err.status || 500);
            res.send({Message: 'Uh Oh... an error occured. We are already working on it. Ref_Num: ' + res.sentry});
        }
    }
});

module.exports = app;
