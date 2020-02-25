module.exports = {
    DEFAULTS: {
        parser: {
            warn: false,
            throw: false,
            pos: true,
            '--': true,
            defaults: null
        },
        arg: {
            id: null,
            alias: null,
            argv: true,
            camel: false,
            snake: false,
            kebab: true,
            env: null,
            type: undefined,
            enum: undefined,
            required: false,
            value: undefined,
            default: undefined,
            _keys: [],
            _errors: [],
            parseUndefined: true,
            warn: false,
            throw: false,
            nativeType: true
        }
    },
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
