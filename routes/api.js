const express = require('express');
const router = express.Router();

router.use('/customer_accounts', require('./customer_accounts'));

module.exports = router;
