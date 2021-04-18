const minimist = require('minimist');
const format = require('util').format;

const types = {
    'true': true,
    'false': false,
    'null': null,
    'undefined': undefined,
    'NaN': NaN
};

function resolveArgv () {
    return minimist(process.argv.slice(2), { '--': true });
}

function isConstructor (F) {
    if (typeof F !== 'function') {
        return false;
    } else {
        try {
            F();
            return false;
        } catch (err) {
            if (err.message.includes(`cannot be invoked without 'new'`)) {
                return true;
            } else {
                return false;
            }
        }
    }
}

function isNumeric (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function toNativeType (val) {
    return val in types ? types[val] : isNumeric(val) ? parseFloat(val) : val;
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
