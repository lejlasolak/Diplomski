const esapi = require('node-esapi');

module.exports = {
    encodeForHtml: (req, res, next) => {
        req.body = process(req.body);
        next();
    }
};

function encode(val) {
    if (typeof val !== 'string') {
        return val;
    }
    return esapi.encoder().encodeForHTML(val);
}

function isObject(object) {
    return (typeof object === "object" || typeof object === 'function') && (object !== null);
}

function process(object) {
    let k;
    if (Array.isArray(object)) {
        for (k = 0; k < object.length; ++k) {
            object[k] = process(object[k]);
        }
        return object;
    } else if (!isObject(object)) {
        return encode(object);
    }
    for (let i in object) {
        if (!object.hasOwnProperty(i)) {
            continue;
        }
        let field = object[i];
        if (Array.isArray(field)) {
            for (k = 0; k < field.length; ++k) {
                field[k] = process(field[k]);
            }
        } else if (isObject(field)) {
            process(field);
        } else {
            object[i] = encode(field);
        }
    }
    return object;
}