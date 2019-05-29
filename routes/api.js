const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/customer_accounts', require('./customer_accounts'));
router.use('/service_accounts', require('./service_accounts/service_accounts'));

module.exports = router;
