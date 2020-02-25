const Parser = require('./lib/parser');
const Arg = require('./lib/arg');

function resolve (args, opts, locals) {
    return new Parser.create(args, opts).resolve(locals);
}

exports = module.exports = resolve;
exports.resolve = resolve;
exports.Arg = Arg;
exports.Parser = Parser;
