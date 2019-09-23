const mongo_helper = require('./mongo.helper');
const validation = require('../../specs/validation.json');
const Ajv = require('ajv');
const ajv = new Ajv({removeAdditional: true, allErrors: true, $data: true});
const _ = require('lodash');
const validate = ajv
    .addSchema(validation, 'validation.json')
    .addKeyword('convert', {
        type: 'string',
        compile: function (sch, parentSchema) {
            if (parentSchema.format === 'date-time' && sch === true) {
                return function (value, objectKey, object, key) {
                    object[key] = new Date(value);
                    return true;
                };
            }
            else {
                return function () {
                    return true;
                };
            }
        }
    });

let validation_helper = {};

validation_helper.validate = function (model, type) {
    return {
        Is_Valid: validate.validate({$ref: 'validation.json#/definitions/' + type}, model),
        Errors: ajv.errorsText(validate.errors, {dataVar: 'Item'}).split(', ')
    };
};

validation_helper.validation_middleware = function (type) {
    return function (req, res, next) {
        try {
            var item = (req.body && !_.isEmpty(req.body)) ? req.body : req.query;
            var validation_result = validation_helper.validate(item, type);

            if (validation_result) {
                if (validation_result.Is_Valid) {
                    req[type] = item;
                    if (req.method == 'PATCH' || req.method == 'POST') {
                        mongo_helper.format_request(req.body);
                    }
                    next();
                }
                else {
                    res.status(400).send(validation_result.Errors);
                }

            }
            else {
                next('Error validating input');
            }
        }
        catch (err) {
            next(err);
        }
    };
};

module.exports = validation_helper;
