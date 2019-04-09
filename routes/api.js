const express = require('express');
const router = express.Router();
const customer = require('./customer');

router.use('/customer_accounts', require('./customer_accounts'));
router.use('/service_accounts', require('./service_accounts'));
router.use('/invoices', require('./invoices'));
router.use('/address', require('./address'));
router.use('/customer', customer);
module.exports = router;
