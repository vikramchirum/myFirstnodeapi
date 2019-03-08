const express = require('express');
const router = express.Router();
const jwt_authorization = require("../lib/jwt_authorization");
const external_api = require('../lib/external_api');

router.use(jwt_authorization.middleware({
    audience: process.env.CUSTOMER_AUDIENCE,
    issuer: process.env.CUSTOMER_ISSUER
}));

router.get('/:id',
    function (req, res, next) {
        jwt_authorization.verify_claims('Customer_Account_Id', req.params.id)(req, res, next);
    },
    async function (req, res, next) {
        try {
            let result = await external_api.get('/api/customer_accounts/' + req.params.id, false);
            if (result && result.status && result.status === 200) {
                res.send(result.body);
            }
            else {
                res.sendStatus(404);
            }
        }
        catch (err) {
            next(err);
        }
    });

module.exports = router;
