const express = require('express');
const router = express.Router();
const validation_helper = require('../lib/helpers/validation.helper');
const gems_service = require('../lib/services/gems.service');
const db = require('../lib/helpers/db.helper');
const ercotresicustomers = db.get('ErcotResiCustomers');
const ercotresicustomersIndex = db.get('ErcotResiCustomersIndex');
const mongo_helper = require('../lib/helpers/mongo.helper');

router.post('/', 
    //validation_helper.validation_middleware('customer'),
    async function (req, res, next) {  
        console.log('in post');
        try
        {
            let fuzzysearch_request = {
                CSPId: req.body.CSPId,
                LastName: req.body.LastName,
                SSN: req.body.SSN,
                DL:req.body.DL,
                PhoneNumber: req.body.PhoneNumber,
                Email: req.body.Email,
                ESIID: req.body.ESIID  
            };
            let results = await gems_service.post_fuzzysearch_request_to_gems(fuzzysearch_request);
            if (results) {
                let fuzzysearch_results = results.map((result) => {
                    return {
                        FirstName: result.FirstName,
                        LastName: result.LastName,
                        EntityID: result.EntityID,
                        PrimaryPhoneNumber: result.PrimaryPhoneNumber,
                        SecondaryPhoneNumber: result.SecondaryPhoneNumber,
                        SSN: result.SSN,
                        DL: result.DL,
                        DateOfBirth: result.DateOfBirth,
                        PrimaryEmail: result.PrimaryEmail,
                        SecondaryEmail: result.SecondaryEmail,
                        CSPId: result.CSPId,
                        CSPStatus: result.CSPStatus,
                        CSPStartDate: result.CSPStartDate,
                        ESIID: result.ESIID,
                        ZipCode: result.ZipCode,
                        AddressLine1: result.AddressLine1,
                        AddressLine2: result.AddressLine2,
                        AddressLine3: result.AddressLine3,
                        AddressLine4: result.AddressLine4,
                        AsOfDateDueAmount: result.AsOfDateDueAmount,
                        BadDebtAmount: result.BadDebtAmount,
                        SearchResultBasedOn: result.SearchResultBasedOn
                    }
                })
                res.send(fuzzysearch_results);
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
    //validation_helper.validation_middleware('address'),
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
