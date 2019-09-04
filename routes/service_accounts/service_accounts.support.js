const express = require('express');
const router = express.Router({ mergeParams: true });
const support_service = require('../../lib/services/support_service');
const validation_helper = require('../../lib/helpers/validation.helper');

router.post('/',
    validation_helper.validation_middleware('contact_us_request'),
    async function (req, res, next) {
        try {

            let request = req.contact_us_request;
            request.Service_Account_Id = req.params.id;

            const response = await support_service.contact_us(request);
            res.send(response);
        }
        catch (err) {
            next(err);
        }
    });

module.exports = router;
