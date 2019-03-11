const express = require('express');
const router = express.Router();

router.use('/customer_accounts', require('./customer_accounts'));
router.use('/invoices', require('./invoices'));

module.exports = router;
