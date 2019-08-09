const express = require('express');
const router = express.Router({mergeParams: true});
const jwt_authorization = require("../../lib/jwt_authorization");
const service_account_service = require('../../lib/services/service_account_service');
const validation_helper = require('../../lib/helpers/validation.helper');

router.get('/',
    jwt_authorization.verify_admin,
    async function (req, res, next) {
        try {

            let result = await service_account_service.get_standard_waivers(req.params.id);
            res.send(result);
        }
        catch (err) {
            next(err);
        }
    });

router.post('/',
    jwt_authorization.verify_admin,
    validation_helper.validation_middleware('waiver_request'),
    async function (req, res, next) {
        try {

            var request = req.waiver_request;
            request.CSRName = req.user.sub;
            request.service_account_id = req.params.id;

            var response = await service_account_service.request_waiver(req.params.id, request);
            res.send(response);
        }
        catch (err) {
            next(err);
        }
    });

module.exports = router;