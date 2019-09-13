const express = require('express');
const router = express.Router({ mergeParams: true });
const rate_change_service = require('../../lib/services/rate_change_service');

router.get('/',
    async function (req, res, next) {
        try {
            const response = await rate_change_service.get_by_service_account_id(req.params.id);
            if (response) {
                res.send(response);
            }
            else{
                res.sendStatus(404);
            }
        }
        catch (err) {
            next(err);
        }
    });

router.get('/details',
    async function (req, res, next) {
        try {
            const response = await rate_change_service.get_details_by_service_account_id(req.params.id);
            if (response) {
                res.send(response);
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
