const Resolver = require('./lib/resolver');
const Arg = require('./lib/arg');

exports = module.exports = Resolver.factory();
exports.resolve = Resolver.resolveFactory();
exports.Arg = Arg;
exports.Resolver = Resolver;
