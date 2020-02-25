const _ = require('lodash');
const constants = require('./constants');
const util = require('./util');

class Arg {

    constructor (opts, ..._defaults) {

        opts = _.defaults(opts, this._defaults, ..._defaults);

        // allows to extend with new defaults from sub classes
        _.each(_.keys(this._defaults), key => {
            this[key] = opts[key];
        });

        this._keys = [];
        this._errors = [];

        // set default and alias keys for argv value lookup
        this._keys.push(this.id);

        if (this.alias) {
            this._keys.push(this.alias);
        }

        if (this.kebab) {
            this._keys.push(_.kebabCase(this.id));
        }

        if (this.camel) {
            this._keys.push(_.camelCase(this.id));
        }

        if (this.snake) {
            this._keys.push(_.snakeCase(this.id));
        }

        this.value = this.default;

        // set default value to env key value if exists
        if (this.env) {
            if (process.env[this.env] !== undefined) {
                this.value = process.env[this.env];
            }
        }

        // set value to argv value if found, stops on first key match
        if (this.argv) {
            _.some(this._keys, key => {
                if (this._argv[key] !== undefined) {
                    this.value = this._argv[key];
                    return true;
                } else {
                    return false;
                }
            });
        }

        // parse value to native type
        // cli and env opts are always strings otherwise
        if (this.nativeType) {
            if (_.isArray(this.value)) {
                this.value = _.map(this.value, val => {
                    return util.toNativeType(val);
                });
            } else {
                this.value = util.toNativeType(this.value);
            }
        }

        // parse custom types if available
        // useful for non cli or env types
        if (this.type && this._canParseType()) {
            if (_.isArray(this.value)) {
                this.value = _.map(this.value, val => {
                    return util.toSpecificType(val, this.type);
                });
            } else {
                this.value = util.toSpecificType(this.value, this.type);
            }
        }

        // check if arg is an enum and if value is a valid enum
        if (this._isEnum()) {
            if (_.isArray(this.value)) {
                _.each(this.value, val => {
                    if (!this._isValidEnum(val)) {
                        this._errors.push(util.format(constants.MSG.missingEnum, this.id, val));
                    }
                });
            } else {
                if (!this._isValidEnum(this.value)) {
                    this._errors.push(util.format(constants.MSG.missingEnum, this.id, this.value));
                }
            }
        }

        // check if value is required
        if (this.required && this.value === undefined) {
            this._errors.push(util.format(constants.MSG.missingRequired, this.id));
        }

        // log error message if desired
        if (this.warn && this._errors.length) {
            console.error(this._errors.join('\n'));
        }

        // throw error if desired
        if (this.throw && this._errors.length) {
            throw new Error(this._errors.join('\n'));
        }

    }

    static get _constants () {
        return constants;
    }

    get _defaults () {
        return Arg._constants.DEFAULTS.arg;
    }

    get _argv () {
        return util.resolveArgv();
    }

    _canParseType () {
        return this.value !== undefined || this.parseUndefined === true;
    }

    _isEnum () {
        return this.enum !== undefined;
    }

    _isValidEnum (val) {
        return _.some(this.enum, e => {
            return _.isEqual(val, e);
        });
    }

    getValue () {
        return this.value;
    }

}

module.exports = Arg;
