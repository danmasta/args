const minimist = require('minimist');
const _ = require('lodash');
const format = require('util').format;

const defaults = {
    parser: {
        env: true,
        argv: true,
        warn: false,
        throw: false,
        errors: true,
        args: null,
        types: true,
        pos: true,
        '--': true,
        parseUndefined: true
    },
    arg: {
        id: null,
        alias: null,
        camel: false,
        snake: false,
        kebab: true,
        env: null,
        type: undefined,
        required: false,
        value: undefined,
        default: undefined,
        keys: [],
        error: [],
        parseUndefined: true
    }
};

const constants = {
    TYPES: {
        true: true,
        false: false,
        null: null,
        undefined: undefined,
        NaN: NaN
    },
    MSG: {
        missingEnum: 'Argument value not found in enums - id: %s, val: %s',
        missingRequired: 'Failed to resolve value for argument - id: %s'
    }
};

class Args {

    constructor (opts) {
        this.opts = opts = _.defaults(opts, defaults.parser);
    }

    _isConstructor (F) {
        try {
            Reflect.construct(Array, [], F);
            return true;
        } catch (err) {
            return false;
        }
    }

    _isNumeric (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    _toNativeType (val) {
        return val in constants.TYPES ? constants.TYPES[val] : this._isNumeric(val) ? parseFloat(val) : val;
    }

    _toSpecificType (val, Type) {
        if (Type !== undefined && this._isConstructor(Type)) {
            return new Type(val);
        } else if (typeof Type === 'function') {
            return Type(val);
        } else {
            return val;
        }
    }

    _canParseType (arg) {
        return arg.value !== undefined || arg.parseUndefined === true || (this.opts.parseUndefined === true && arg.parseUndefined !== false);
    }

    _isEnum (val, enums) {
        return _.some(enums, e => {
            return _.isEqual(val, e);
        });
    }

    _resolveArgv () {
        return minimist(process.argv.slice(2), { '--': true });
    }

    _resolveArgs (locals) {

        let argv = this._resolveArgv();

        let args = _.map(this.opts.args, arg => {

            let val = undefined;

            arg = _.defaults(arg, defaults.arg);

            arg.keys = [arg.id];

            if (arg.kebab) {
                arg.keys.push(_.kebabCase(arg.id));
            }

            if (arg.alias) {
                arg.keys.push(arg.alias);
            }

            if (arg.camel) {
                arg.keys.push(_.camelCase(arg.id));
            }

            if (arg.snake) {
                arg.keys.push(_.snakeCase(arg.id));
            }

            arg.value = arg.default;

            if (this.opts.env && arg.env) {
                if (process.env[arg.env] !== undefined) {
                    arg.value = process.env[arg.env];
                }
            }

            if (this.opts.argv) {
                _.some(arg.keys, key => {
                    if ((val = argv[key]) && val !== undefined) {
                        return true;
                    } else {
                        return false;
                    }
                });
            }

            if (val !== undefined) {
                arg.value = val;
            }

            if (locals && locals[arg.id] !== undefined) {
                arg.value = locals[arg.id];
            }

            if (this.opts.types && this._canParseType(arg)) {
                if (_.isArray(arg.value)) {
                    arg.value = _.map(arg.value, val => {
                        return this._toNativeType(val);
                    });
                } else {
                    arg.value = this._toNativeType(arg.value);
                }
            }

            if (arg.type && this._canParseType(arg)) {
                if (_.isArray(arg.value)) {
                    arg.value = _.map(arg.value, val => {
                        return this._toSpecificType(val, arg.type);
                    });
                } else {
                    arg.value = this._toSpecificType(arg.value, arg.type);
                }
            }

            if (arg.enum) {
                if (_.isArray(arg.value)) {
                    _.each(arg.value, val => {
                        if (!this._isEnum(val, arg.enum)) {
                            arg.error.push(format(constants.MSG.missingEnum, arg.id, val));
                        }
                    });
                } else {
                    if (!this._isEnum(arg.value, arg.enum)) {
                        arg.error.push(format(constants.MSG.missingEnum, arg.id, arg.value));
                    }
                }
            }

            if (arg.value === undefined && arg.required) {
                arg.error.push(format(constants.MSG.missingRequired, arg.id));
            }

            return arg;

        });

        if (this.opts.pos) {
            args.push({
                id: '_pos',
                value: argv._
            });
        }

        if (this.opts['--']) {
            args.push({
                id: '--',
                value: argv['--']
            });
        }

        return args;

    }

    _resolveValues (args) {

        let res = {};

        _.each(args, arg => {
            res[arg.id] = arg.value;
        });

        return res;

    }

    _resolveErrors (args) {

        let res = [];

        _.each(args, arg => {
            if (arg.error) {
                res = _.concat(arg.error);
            }
        });

        return res;

    }

    resolve (locals) {

        let args = this._resolveArgs(locals);
        let vals = this._resolveValues(args);
        let errs = this._resolveErrors(args);
        let msgs = errs.join('\n');

        if (this.opts.errors) {
            if (errs.length) {
                vals._errors = errs;
            } else {
                vals._errors = null;
            }
        }

        if (this.opts.warn && errs.length) {
            console.error(msgs);
        }

        if (this.opts.throw && errs.length) {
            throw new Error(msgs);
        }

        return vals;

    }

}

function resolve (opts, locals) {
    return new Args(opts).resolve(locals);
}

exports = module.exports = resolve;
exports.Args = Args;
exports.resolve = resolve;
