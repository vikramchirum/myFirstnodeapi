const express = require('express');
const router = express.Router();
const jwt_authorization = require("../lib/jwt_authorization");
const customer_correspondence_service = require('../lib/services/customer_correspondence_service');

router.use(jwt_authorization.middleware({
    audience: process.env.AUDIENCE,
    issuer: [process.env.CUSTOMER_ISSUER, process.env.INTERNAL_ISSUER]
}));

router.get('/disconnect_letter_info/:id',
    jwt_authorization.verify_claims_from_request_property('Customer_Account_Id', 'params.id'),
    async function (req, res, next) {
        try {
            let disconnectLetterInfo = await customer_correspondence_service.get_disconnect_letter_info(req.params.id);
            if (disconnectLetterInfo) {
                res.send(disconnectLetterInfo);
            }
            else{
                res.sendStatus(404);
            }
        }
        catch (err) {
            next(err);
        }
    });

    module.exports = router;    