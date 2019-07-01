const express = require('express');
const router = express.Router({ mergeParams: true });
const jwt_authorization = require("../../lib/jwt_authorization");
const notification_option_service = require('../../lib/services/notification_option_service');
const validation_helper = require('../../lib/helpers/validation.helper');

router.get('/',
    jwt_authorization.verify_claims_from_request_property('Customer_Account_Id', 'params.id'),
    async function (req, res, next) {
        try {
            let query = {
                'Account_Info.Account_Type': "GEMS_Residential_Customer_Account",
                'Account_Info.Account_Number': req.params.id
            };
            Object.assign(query, req.query);
            const response = await notification_option_service.search(query);
            if (response) {
                res.send(response);
            }
            else {
                res.sendStatus(404);
            }
        }
        catch (err) {
            next(err);
        }
    });

router.post('/',
    jwt_authorization.verify_claims_from_request_property('Customer_Account_Id', 'params.id'),
    validation_helper.validation_middleware('notification_option_create_request'),
    async function (req, res, next) {
        try {
            const response = await notification_option_service.setup(req.params.id, req.notification_option_create_request);
            if (response) {
                res.send(response);
            }
            else {
                res.sendStatus(404);
            }
        }
        catch (err) {
            next(err);
        }
    });

router.get('/:type',
    jwt_authorization.verify_claims_from_request_property('Customer_Account_Id', 'params.id'),
    async function (req, res, next) {
        let query = {
            'Account_Info.Account_Type': "GEMS_Residential_Customer_Account",
            'Account_Info.Account_Number': req.params.id,
            Type: req.params.type
        };
        const response = await notification_option_service.search(query);
        if (response && response.length) {
            res.send(response[0]);
        }
        else {
            res.sendStatus(404);
        }
    });

router.delete('/:type',
    jwt_authorization.verify_claims_from_request_property('Customer_Account_Id', 'params.id'),
    async function (req, res, next) {
        const response = await notification_option_service.cancel(req.params.id, req.params.type);
        if (response) {
            res.send(response);
        }
        else {
            res.sendStatus(404);
        }
    });

module.exports = router;
