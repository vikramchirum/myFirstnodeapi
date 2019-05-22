const express = require('express');
const router = express.Router({mergeParams: true});
const jwt_authorization = require("../../lib/jwt_authorization");
const payment_extension_service = require('../../lib/services/payment_extension_service');
const validation_helper = require('../../lib/helpers/validation.helper');

router.get('/',
    jwt_authorization.verify_claims_from_request_property('Service_Account_Ids', 'params.id'),
    async function (req, res, next) {
        try {
            const response = await payment_extension_service.get_by_service_account_id(req.params.id);
            res.send(response);
        }
        catch (err) {
            next(err);
        }
    });

router.post('/',
    jwt_authorization.verify_claims_from_request_property('Service_Account_Ids', 'params.id'),
    validation_helper.validation_middleware('payment_extension_request'),
    async function (req, res, next) {
        try {
            let override_date = null;
            if (req.body && req.body.Override_Date){
                override_date = req.body.Override_Date;
            }
            const response = await payment_extension_service.request_payment_extension_by_service_account_id(req.params.id, req.user.sub, override_date);
            if (response.Status === 'SUCCESS'){
                res.send(response.ExtendedDate);
            }
            else{
                res.status(400).send(response.Status);
            }
        }
        catch (err) {
            next(err);
        }
    });

module.exports = router;
