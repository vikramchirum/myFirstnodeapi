const express = require('express');
const router = express.Router({mergeParams: true});
const jwt_authorization = require("../../lib/jwt_authorization");
const service_account_service = require('../../lib/services/service_account_service');
const validation_helper = require('../../lib/helpers/validation.helper');

router.get('/',
    async function (req, res, next) {
        try {
            let result = await service_account_service.get_credits(req.params.id);
            res.send(result);
        }
        catch (err) {
            next(err);
        }
    });

router.post('/',
    validation_helper.validation_middleware('service_account_credit_request'),
    async function (req, res, next) {
        try {

            let request = {};
            request.service_account_id = req.params.id;
            request.CreationDate = new Date;
            request.CSRName = req.user.sub;
            request.Amount = req.Amount;
            request.Notes = req.Notes;
            request.CreditType = req.Credit_Type;

          //  var request = req.service_account_credit_request;
          //  request.CSRName = req.user.sub;
          //  request.service_account_id = req.params.id;
            //request.c

            var response = await service_account_service.post_credit(req.params.id, request);
            res.send(response);
        }
        catch (err) {
            next(err);
        }
    });

module.exports = router;
