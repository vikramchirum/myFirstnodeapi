const request = require('superagent');
const logger = require('log-driver').logger;
const querystring = require('querystring');
const url = require('url');
const creds = Buffer.from(process.env.EXTERNAL_API_PASSPHRASE).toString('base64');
const auth_header_value = 'Basic ' + creds;

const prefix = require('superagent-prefix');
const external_api_prefix = prefix(process.env.EXTERNAL_API_URL);

let external_api = {};

const request_logger = function (req) {
    try {
        let uri = url.parse(req.url);
        let info = {
            start: new Date().getTime(),
            timestamp: new Date().toISOString(),
            method: req.method,
            href: uri.href,
            query_string: req.qs ? '?' + querystring.stringify(req.qs) : '',
            protocol: uri.protocol.toUpperCase().replace(/[^\w]/g, '')
        };

        req.on('response', function (res) {
            info.end = new Date().getTime();
            info.elapsed = info.end - info.start;
            info.size = res.headers['content-length'];
            info.status = res.status;

            logger.info({
                level: 'info',
                message: info.protocol + ' ' + info.method + ' ' + info.href + ' ' + info.query_string + ' ' + info.status + ' ' + info.size + ' ' + info.elapsed,
                data: info
            });
        });
    }
    catch (err) {
        logger.error({level: 'error', message: err.message});
    }
    finally {
        return req;
    }
};

external_api.get = function (endpoint, binary) {
    let req = request
        .get(endpoint)
        .set('Authorization', auth_header_value)
        .use(external_api_prefix)
        .use(request_logger);
    if (binary) {
        req
            .responseType('blob');
    }
    return req;
};

external_api.search = function (endpoint, query) {
    return request
        .get(endpoint)
        .query(query)
        .set('Authorization', auth_header_value)
        .use(external_api_prefix)
        .use(request_logger);
};

external_api.put = function (endpoint, body) {
    return request
        .put(endpoint)
        .send(body)
        .set('Authorization', auth_header_value)
        .use(external_api_prefix)
        .use(request_logger);
};

external_api.post = function (endpoint, body) {
    return request
        .post(endpoint)
        .send(body)
        .set('Authorization', auth_header_value)
        .use(external_api_prefix)
        .use(request_logger);
};

external_api.clean_response = function (result) {
    if (result && result.status && result.status === 200) {
        if (result.body) {
            return result.body;
        }
        else {
            return null;
        }
    }
    else if (result && result.status) {
        throw new Error(result.message);
    }
    else {
        return null;
    }
};

external_api.format_result_middleware = function (req, res, next) {
    let result = req.Result;
    if (result && result.status && result.status === 200) {
        if (result.body) {
            req.Result = result.body;
            next();
        }
        else {
            res.sendStatus(404);
        }
    }
    else if (result && result.status) {
        next(new Error(result.message));
    }
    else {
        res.sendStatus(404);
    }
};

module.exports = external_api;
