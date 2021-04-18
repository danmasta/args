const util = require('./util');
const _ = require('lodash');

const defaults = {
    id: undefined,
    description: undefined,
    alias: undefined,
    argv: true,
    camel: false,
    snake: false,
    kebab: true,
    env: undefined,
    type: undefined,
    enum: undefined,
    required: false,
    value: undefined,
    default: undefined,
    keys: [],
    parseUndefined: true,
    warn: false,
    throw: false,
    nativeType: true,
    nullable: false
};

let argv = util.resolveArgv();

class InvalidArgumentError extends Error {

    constructor (msg) {
        super(msg);
        Error.captureStackTrace(this, InvalidArgumentError);
        this.name = 'InvalidArgumentError';
        this.code = 'INVALIDARGUMENT';
    }

}

class Arg {

    constructor (opts) {

        _.defaults(this, opts, defaults);

        this.keys = [];

        // set default keys for argv value lookup
        this.addKey(this.id);

        // set alias keys for argv value lookup
        if (this.alias) {
            this.addKey(this.alias);
        }

        if (this.kebab) {
            this.addKey(_.kebabCase(this.id));
        }

        if (this.camel) {
            this.addKey(_.camelCase(this.id));
        }

        if (this.snake) {
            this.addKey(_.snakeCase(this.id));
        }

        // set default value
        if (this.default !== undefined) {
            this.setValue(this.default);
        }

        // set value to env variable key if exists
        if (this.env) {
            if (process.env[this.env] !== undefined) {
                this.setValue(process.env[this.env]);
            }
        }

        // set value to argv value if found
        // stops on first match
        if (this.argv) {
            _.some(this.keys, (val) => {
                if (argv[val] !== undefined) {
                    this.setValue(argv[val]);
                    return true;
                } else {
                    return false;
                }
            });
        }

    }

    _handleError (...args) {

        let str = util.format(...args);

        if (this.throw) {
            throw new InvalidArgumentError(str);
        } else if (this.warn) {
            console.error(str);
        }

    }

    // add key for argv lookup
    addKey (key) {
        if (typeof key === 'string' && key.length && !this.keys.includes(key)) {
            this.keys.push(key);
        }
    }

    getValue () {
        return this.value;
    }

    setValue (value) {

        let isArray = _.isArray(value);
        let res = isArray ? [] : undefined;

        value = this.castValue(value);

        _.each(_.concat(value), val => {

            if (this.isEnum() && !this.isValidEnumValue(val)) {
                this._handleError('Failed to set value, not a valid enum -- id: %s, val: %s', this.id, val);
            }

            if (isArray) {
                res.push(val);
            } else {
                res = val;
            }

        });

        if ((!isArray && res !== undefined) || (isArray && res.length > 0) || (this.nullable && res === undefined)) {
            this.value = res;
        }

        return this.value;

    }

    castValue (val) {

        if (_.isArray(val)) {

            return _.map(val, this.castValue.bind(this));

        } else {

            if (this.nativeType) {
                val = util.toNativeType(val);
            }

            if (this.type && this.canParseType()) {
                val = util.toSpecificType(val, this.type);
            }

            return val;

        }

    }

    resolveValue () {

        if (this.isMissingRequired()) {
            return this._handleError('Failed to resolve value for required argument -- id: %s', this.id);
        }

        if (this.isEnum() && !this.isValidEnum()) {
            return this._handleError('Failed to resolve value, not a valid enum -- id: %s, val: %s', this.id, this.value);
        }

        return this.value;

    }

    canParseType () {
        return (this.value !== undefined || this.parseUndefined === true) && this.type !== undefined;
    }

    isEnum () {
        return this.enum !== undefined;
    }

    isValidEnumValue (val) {
        if (this.nullable && val === undefined) {
            return true;
        }
        return _.some(_.concat(this.enum), e => {
            return _.isEqual(val, e);
        });
    }

    isValidEnum () {
        return _.every(_.concat(this.getValue()), val => {
            return this.isValidEnumValue(val);
        });
    }

    isMissingRequired () {
        return this.required && (this.value === undefined || this.value.length === 0) && !this.nullable;
    }

    isValid () {

        if (this.isMissingRequired()) {
            return false;
        }

        if (this.isEnum() && !this.isValidEnum()) {
            return false;
        }

        return true;

    }

    static factory () {
        let Fn = this;
        return function argFactory (...args) {
            return new Fn(...args);
        };
    }

}

module.exports = Arg;
