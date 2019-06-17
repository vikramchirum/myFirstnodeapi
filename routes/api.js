const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/customer_accounts', require('./customer_accounts'));
router.use('/service_accounts', require('./service_accounts/service_accounts'));

//Remove later after implementing service_accounts/:id/correspondence
router.use('/customer_correspondence', require('./customer_correspondence'));

module.exports = router;
