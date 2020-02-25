const _ = require('lodash');
const Arg = require('./arg');
const constants = require('./constants');
const util = require('./util');

class Parser {

    constructor (args, opts) {

        this.opts = opts = _.defaults(opts, this._defaults);

        this.args = _.map(args, arg => {
            return new this._Arg(arg, opts.defaults);
        });

        if (opts.pos) {
            this.args.push(new this._Arg({
                id: '_pos',
                value: this._argv['_']
            }));
        }

        if (opts['--']) {
            this.args.push(new this._Arg({
                id: '--',
                value: this._argv['--']
            }));
        }

        this._errors = this._resolveErrors();

        if (opts.warn && this._errors.length) {
            console.error(this._errors.join('\n'));
        }

        if (opts.throw && this._errors.length) {
            throw new Error(this._errors.join('\n'));
        }

    }

    static get _constants () {
        return constants;
    }

    get _defaults () {
        return Parser._constants.DEFAULTS.parser;
    }

    get _argv () {
        // return argv;
        return util.resolveArgv();
    }

    get _Arg () {
        return Arg;
    }

    static create (...args) {
        return new this(...args);
    }

    static createArg (...args) {
        return new this._Arg(...args);
    }

    _resolveArgs () {
        return this.args;
    }

    // resolve values for args
    // locals count as manual overrides and are not validated
    // returns a hash of key value pairs
    _resolveValues (locals) {

        let res = {};

        _.each(this.args, arg => {
            res[arg.id] = arg.value;
        });

        if (locals) {
            _.each(locals, (val, key) => {
                res[key] = val;
            });
        }

        return res;

    }

    // resolves all error messages for current args
    // returns array
    _resolveErrors () {

        let res = [];

        _.each(this.args, arg => {
            if (arg._errors.length) {
                res = _.concat(res, arg._errors);
            }
        });

        return res;

    }

    resolve (locals) {

        let vals = this._resolveValues(locals);
        let errs = this._resolveErrors();
        let msgs = errs.join('\n');

        if (this.opts.warn && errs.length) {
            console.error(msgs);
        }

        if (this.opts.throw && errs.length) {
            throw new Error(msgs);
        }

        return vals;

    }

}

module.exports = Parser;
