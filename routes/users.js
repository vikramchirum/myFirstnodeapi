const express = require('express');
const router = express.Router();

const jwt_authorization = require("../lib/jwt_authorization");
const validation_helper = require('../lib/helpers/validation.helper');
const users_service = require('../lib/services/user.service');

router.get('/',
    validation_helper.validation_middleware("search_user_request"),
    async function (req, res, next) {
        try {
            let user_info = await users_service.get_user_name((req.query));
            res.send(user_info);
        } catch (err) {
            next(err);
        }
    });

router.get('/primary_user_account',
    async function (req, res, next) {
        try {

            if (!req.query || ! req.query['Service_Account_Id']) {
                res.status(400);
                res.send({Message: "Service Account Id is required."});
            }

            let user_info = await users_service.get_primary_user_account(req.query['Service_Account_Id']);
            res.send(user_info);

        } catch (err) {
            next(err);
        }
    });

router.put('/email_user_name',
    validation_helper.validation_middleware("email_user_name_request"),
    async function (req, res, next) {
        try {
            let request = req.email_user_name_request;
            await users_service.email_user_name(request);
            res.send({"Is_Success": true});
        } catch (err) {
            next(err);
        }
    });



router.put('/send_reset_password_email',
    async function (req, res, next) {
        try {
            if (!req.body.User_Name) {
                res.status(400);
                res.send({Message: "User Name is required to send a password reset email."});
            }

            await users_service.send_reset_password_email(req.body.User_Name);
            res.send({Is_Success: true});
        } catch (err) {
            next(err);
        }
    });

module.exports = router;