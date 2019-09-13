const express = require('express');
const router = express.Router({ mergeParams: true });
const notes_service = require('../../lib/services/notes_service');
const validation_helper = require('../../lib/helpers/validation.helper');

router.post('/',
    validation_helper.validation_middleware('customer_account_add_note_request'),
    async function (req, res, next) {
        try {

            var note_request = req.customer_account_add_note_request;
            note_request.User = req.user.sub;

            var response = await notes_service.post_customer_account_notes(req.params.id, note_request);
            res.send(response);
        }
        catch (err) {
            next(err);
        }
    });

router.get('/:count?',
    async function (req, res, next) {
        try {

            if (!req.params.count || req.params.count === '0') {
                req.params.count = 20;
            }

            var response = await notes_service.get_customer_account_notes(req.params.id, req.params.count);
            res.send(response);
        }
        catch (err) {
            next(err);
        }
    });

module.exports = router;