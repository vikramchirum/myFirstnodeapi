const express = require('express');
const router = express.Router({mergeParams: true});
const jwt_authorization = require("../../lib/jwt_authorization");
const invoice_service = require('../../lib/services/invoice_service');

router.get('/',
    async function (req, res, next) {
        try {
            let result = await invoice_service.get_by_service_account_id(req.params.id);
            res.send(result);
        }
        catch (err) {
            next(err);
        }
    });

router.get('/:invoice_id',
    async function (req, res, next) {
        try {
            let result = await invoice_service.get_single(req.params.id, req.params.invoice_id);
            res.send(result);
        }
        catch (err) {
            next(err);
        }
    });

router.get('/:invoice_id/details',
    async function (req, res, next) {
        try {
            let result = await invoice_service.get_single_details(req.params.id, req.params.invoice_id);
            res.send(result);
        }
        catch (err) {
            next(err);
        }
    });

router.get('/:invoice_id/download', 
    async function (req, res, next) {
        try {
            let response = await invoice_service.download_invoice(req.params.invoice_id);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Length', response.bytes.length);
            res.setHeader('Content-Disposition', 'attachment; filename=' + response.id + '.pdf');
            res.send(response.bytes);
        }
        catch (err) {
            next(err);
        }
    });

router.get('/:invoice_id/meter_read_details', 
    async function (req, res, next) {
        try {
            let result = await invoice_service.get_meter_read_details(req.params.id, req.params.invoice_id);
            res.send(result);
        }
        catch (err) {
            next(err);
        }
    });

module.exports = router;
