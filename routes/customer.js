const express = require('express');
const router = express.Router();
const validation_helper = require('../lib/helpers/validation.helper');
const external_api = require('../lib/external_api');
const db = require('../lib/helpers/db.helper');
const ercotresicustomersIndex = db.get('ErcotResiCustomersIndex');

router.post('/',
    validation_helper.validation_middleware('customer'),
    async function (req, res, next) {
        try
        {
            let results = await external_api.post('/api/customer_accounts/FuzzySearch', fuzzysearch_request);
            if (results) {
                res.send(results);
            }
            else {
                res.sendStatus(404);
            }
        }
        catch(err) {
            next(err);
        }

    });

    router.post('/fromMongoDB',
    validation_helper.validation_middleware('customer'),
    async function (req, res, next) {
        //console.log("ok");
        try {
            //1. if CSP is provided, no need to query rest other search criteria
            //2. if SSN is provided, no need to query rest other search criteria
            let query = { type: "SSN" };
            let results = await ercotresicustomersIndex.find(query,{ limit : 10 })
            if(results)
            {
                console.log("results");
            }
            //3. if DL is provided, no need to query rest other search criteria
            //4. if combition of these fields (last name + ESID)
            //                             or (last name + phone)
            //                             or (last name + email) is provided
            //5. any other serach criteria provided


            res.sendStatus(404);
        }
        catch (err) {
            next(err);
        }

    });


module.exports = router;
