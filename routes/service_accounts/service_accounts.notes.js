const express = require('express');
const router = express.Router({mergeParams: true});
const jwt_authorization = require("../../lib/jwt_authorization");
const service_account_service = require('../../lib/services/service_account_service');

router.get('/:count',
    jwt_authorization.verify_claims_from_request_property('Service_Account_Ids', 'params.id'),
    async function (req, res, next) {
        try {

            let result = await service_account_service.get_notes(req.params.id, req.params.count);
            res.send(result);
        }
        catch (err) {
            next(err);
        }
    });

router.post('/',
    jwt_authorization.verify_claims_from_request_property('Service_Account_Ids', 'params.id'),
    async function (req, res, next) {
        try {

            var note_req = req.body;
            note_req.User =  req.user.sub;
            let result = await service_account_service.post_notes(req.params.id, note_req);
            res.send(result);
        }
        catch (err) {
            next(err);
        }
    });

module.exports = router;