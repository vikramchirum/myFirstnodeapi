const request = require('superagent');
const logger = require('log-driver').logger;
const querystring = require('querystring');
const url = require('url');

const fs = require('fs');
const path = require('path');
const pfx = fs.readFileSync(path.resolve(__dirname, '../certs/' + process.env.EXTERNAL_API_PFX + '.pfx'));
const cert = {pfx: pfx, passphrase: process.env.EXTERNAL_API_PFX_PASS};

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
            query_string: req.qs ? '' : '?' + querystring.encode(req.rs),
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
        .pfx(cert)
        .use(external_api_prefix)
        .use(request_logger);
    if (binary) {
        req
            .responseType('blob');
    }
    return req;
};

external_api.post = function (endpoint, body) {
    return request
        .post(endpoint)
        .send(body)
        .pfx(cert)
        .use(external_api_prefix)
        .use(request_logger);
};

module.exports = external_api;
