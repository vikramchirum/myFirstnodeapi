const forge = require('node-forge');
const pki = forge.pki;


let auth_client_cert = function (ca_cert) {

    const ca_store = pki.createCaStore([ca_cert]);
    const logger = require('../lib/logger');

    return function (req, res, next) {
        if (ca_cert) {
            try {

                let log_obj = {
                    message: 'Verifying the CA Cert',
                    level: 'info'
                };
                logger.log(log_obj);

                const header = req.get('X-ARR-ClientCert');
                if (!header) {
                    log_obj = {
                        message: 'Header is null from request. Missing the header for Certificate',
                        level: 'info'
                    };
                    logger.log(log_obj);
                    throw new Error('UNAUTHORIZED');
                }

                const pem = `-----BEGIN CERTIFICATE-----\n${header}\n-----END CERTIFICATE-----`;
                const incomingCert = pki.certificateFromPem(pem);

                let result = pki.verifyCertificateChain(ca_store, [incomingCert]);

                next();
            }
            catch (err) {
                logger.log({
                    level: 'error',
                    message: err.message,
                    error: err
                });
                res.status(401).send('UNAUTHORIZED');
            }
        }
        else {
            next();
        }
    };
};

module.exports = auth_client_cert;
