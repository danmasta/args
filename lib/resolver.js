const _ = require('lodash');
const Arg = require('./arg');

const defaults = {
    pos: true,
    sub: true,
    defaults: undefined
};

class Resolver {

    constructor (args, opts) {

        this.opts = opts = _.defaults(opts, defaults);

        this.args = _.map(_.concat(args), arg => {
            return new Arg(_.defaults(arg, opts.defaults));
        });

        if (opts.pos) {
            this.args.push(new Arg({
                id: '_',
                kebab: false
            }));
        }

        if (opts.sub) {
            this.args.push(new Arg({
                id: '--',
                kebab: false
            }));
        }

    }

    getValues (locals) {

        let res = {};

        _.each(this.args, arg => {
            res[arg.id] = arg.getValue();
        });

        return _.assign(res, locals);

    }

    resolveValues (locals) {

        let res = {};

        _.each(this.args, arg => {

            if (_.isPlainObject(locals) && locals.hasOwnProperty(arg.id)) {
                arg.setValue(locals[arg.id]);
            }

            res[arg.id] = arg.resolveValue();

        });

        return res;

    }

    resolve (locals) {
        return this.resolveValues(locals);
    }

    static factory () {
        let Fn = this;
        return function resolverFactory (...args) {
            return new Fn(...args);
        };
    }

    static resolveFactory () {
        let Fn = this;
        return function resolveFactory (args, opts, locals) {
            return new Fn(args, opts).resolve(locals);
        };
    }

}

module.exports = Resolver;
