const express = require('express');
const router = express.Router();
const db = require('../lib/helpers/db.helper');
const service_locations = db.get('Service_Locations');
const validation_helper = require('../lib/helpers/validation.helper');

router.post('/', 
    validation_helper.validation_middleware('address'),
    async function (req, res, next) {  
        try {
            let results = await service_locations.find({ 
                addr1: req.body.Line_1,
                addr2: req.body.Line_2,
                city: req.body.City,
                state: req.body.State,
                zip: req.body.Zip
            })
            if (results) {
                let service_locations = results.map((result) => {
                    return {
                        Line_1: result.addr1,
                        Line_2: result.addr2,
                        City: result.city,
                        State: result.state,
                        Zip: result.zip,
                        Esiid: result.esiid,
                        Premise_Type: result.premiseType,
                        Status: result.status,
                        Meter_Type: result.meterType,
                        Switch_Hold: result.switchHold,
                        Debt_Hold: result.debtHold 
                    }
                })
                res.send(service_locations);
            }
            else {
                res.sendStatus(404);
            }
        }
        catch (err) {
            next(err);
        }
    });

module.exports = router;