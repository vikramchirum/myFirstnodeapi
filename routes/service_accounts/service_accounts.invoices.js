const express = require('express');
const router = express.Router({mergeParams: true});
const invoice_service = require('../../lib/services/invoice_service');
const _ = require('lodash');

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

router.get('/latest',
    async function (req, res, next) {
        try {
            let result = await invoice_service.get_by_service_account_id(req.params.id);
            if (result && result.length){
                const sorted = _.orderBy(result, ['Due_Date'], ['desc']);
                res.send(sorted[0]);
            }
            else{
                res.sendStatus(404);
            }
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
            res.setHeader('Content-Disposition', 'attachment; filename=' + req.params.invoice_id + '.pdf');
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
