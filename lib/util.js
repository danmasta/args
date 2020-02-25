const _ = require('lodash');
const minimist = require('minimist');
const format = require('util').format;
const constants = require('./constants');

function resolveArgv () {
    return minimist(process.argv.slice(2), { '--': true });
}

function isConstructor (F) {
    try {
        Reflect.construct(Array, [], F);
        return true;
    } catch (err) {
        return false;
    }
}

function isNumeric (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function toNativeType (val) {
    return val in constants.TYPES ? constants.TYPES[val] : isNumeric(val) ? parseFloat(val) : val;
}

function toSpecificType (val, Type) {
    if (Type !== undefined && isConstructor(Type)) {
        return new Type(val);
    } else if (typeof Type === 'function') {
        return Type(val);
    } else {
        return val;
    }
}

exports.resolveArgv = resolveArgv;
exports.isConstructor = isConstructor;
exports.isNumeric = isNumeric;
exports.toNativeType = toNativeType;
exports.toSpecificType = toSpecificType;
exports.format = format;
