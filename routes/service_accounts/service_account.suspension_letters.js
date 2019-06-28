const express = require('express');
const router = express.Router({mergeParams: true});
const jwt_authorization = require("../../lib/jwt_authorization");
const suspension_letter_service = require('../../lib/services/suspension_letter_service');

router.get('',
    jwt_authorization.verify_claims_from_request_property('Service_Account_Ids', 'params.id'),
    async function (req, res, next) {
        try {
            let disconnectLetterInfo = await suspension_letter_service.get_disconnect_letter_info(req.params.id);
            if (disconnectLetterInfo) {
                res.send(disconnectLetterInfo);
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