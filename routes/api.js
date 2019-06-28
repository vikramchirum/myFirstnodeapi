const express = require('express');
const router = express.Router();
const auth_client_cert = require('../lib/auth_client_cert');

if (process.env.CA_CERT) {
    router.use(auth_client_cert(process.env.CA_CERT));
}

router.use('/auth', require('./auth'));
router.use('/customer_accounts', require('./customer_accounts'));
router.use('/service_accounts', require('./service_accounts/service_accounts'));

module.exports = router;
