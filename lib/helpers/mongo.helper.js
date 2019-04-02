let monk = require('monk');

let parse_query_string = function (query) {
    let date_time_test = RegExp(/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/);
    if (query) {
        for (var prop in query) {
            if (typeof query[prop] === 'object') {
                parse_query_string(query[prop]);
            }

            if (prop.includes('_id')) {
                query[prop] = monk.id(query[prop]);
            }
            else if (query[prop] === 'null' || query[prop] === '') {
                query[prop] = null;
            }
            else if (query[prop] === 'true') {
                query[prop] = true;
            }
            else if (query[prop] === 'false') {
                query[prop] = false;
            }
            else if (date_time_test.test(query[prop])){
                query[prop] = new Date(query[prop]);
            }
            else if (!isNaN(parseInt(query[prop]))) {
                query[prop] = parseFloat(query[prop]);
            }
        }
        return query;
    }
    else {
        return query;
    }
};

const format_request_middleware = function (req, res, next) {
    if (req.method == 'PATCH' || req.method == 'POST') {
        format_request(req.body);
    }
    next();
};

const format_request = function (obj) {
    for (var k in obj) {
        if (typeof obj[k] == "object" && obj[k] !== null)
            format_request(obj[k]);
        else {
            obj[k] = json_parse_reviver(k, obj[k]);
        }
    }
};

const json_parse_reviver = function (key, value) {
    if (typeof value === 'string') {
        let date_time_test = RegExp(/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/);
        let mongo_id_test = RegExp(/^[a-fA-F0-9]{24}$/);
        let boolean_test = RegExp(/true|false/);
        if (date_time_test.test(value)) {
            return new Date(value);
        }
        else if (mongo_id_test.test(value)){
            return monk.id(value);
        }
        else {
            return value;
        }
    }
    else {
        return value;
    }
}

const query_string_middleware = function (req, res, next) {
    if (req.query) {
        req.query = parse_query_string(req.query);
    }
    next();
};

const read_only_properties = ['_id', 'Date_Created', 'Date_Last_Modified', 'Notes'];

const patch_strip_middleware = function (req, res, next) {
    if (req.method == 'PATCH') {
        let update_request = req.body;
        read_only_properties.forEach(function (value, index) {
            if (update_request[value])
                delete update_request[value];
        });
        req.body = update_request;
    }
    next();
};

module.exports = {
    parse_query_string: parse_query_string,
    query_string_middleware: query_string_middleware,
    json_parse_reviver: json_parse_reviver,
    format_request_middleware: format_request_middleware,
    patch_strip_middleware: patch_strip_middleware,
    format_request: format_request
};
