# Args
Parse arguments from argv, env variables, and locals

Features:
* Easy to use
* Parse arguments from argv, env variables, and locals
* Coerce to native and/or specified type (class or factory function)
* Supports defaults and aliases
* Supports multiple key formats (snake, camel, kebab)
* Can return errors as a list, throw them, or write to stderr
* Supports positional and sub process (--) arguments
* Supports enums
* Extendable

## About
We needed a better way to parse application arguments across a variety of interfaces. It's simple enough if you build only a node api, but what if you want to expose a cli component as well? Now you have to worry about parsing argv options and types from multiple formats. What if you wanted to expose configuration for the same options via env variables? It starts to become a complicated mess or parsing values and remembering order and precidence and types.

This package aims to take care of all that for you. Simply define your arguments in a declaritive way, wether you want env variables, argv variables, or local variables, and it will resolve all the options and return a single object. You can request specific types by providing classes or factory functions, you can set defaults, and you can specify required-ness and how to handle errors.

## Usage
Add args as a dependency for your app and install via npm
```
npm install @danmasta/args --save
```
Require the package in your app
```javascript
const args = require('@danmasta/args');
```

<!-- `env` | *`boolean`* | Wether or not to parse argument values from `process.env`. Default is `true`
`errors` | *`boolean`* | If true error messages will be added to output at `_error`. Default is `true`
`args` | *`array`* | List of argument options to parse for output. Default is `null`
`types` | *`boolean`* | If true will attempt to coerce argument values to native types. This is useful for env variables and argv (which are always strings). Default is `true`
`parseUndefined` | *`boolean`* | Wether or not to attempt to coerce types for `undefined` values. This goes for native types and custom types. Default is `true` -->

### Options
#### Parser
name | type | description
-----|------|------------
`warn` | *`boolean`* | If true will write errors to `stderr` for missing required fields and invalid enum values. Default is `false`
`throw` | *`boolean`* | If true will throw errors on missing required fields and invalid enum values. Default is `false`
`pos` | *`boolean`* | If true any positional arguments from argv will be added to output at `_pos`. Default is `true`
`--` | *`boolean`* | If true any sub-process arguments from argv will be added to output at `--`. Default is `true`
`defaults` | *`object`* | Default option values to set for all arguments. Default is `null`

#### Arguments
name | type | description
-----|------|------------
`id` | *`string`* | This is used for initial value lookup from argv. It is also used as the output key in resolved options. Default is `null`
`alias` | *`string`* | Which alias key to use for argv arguments. Default is `null`
`argv` | *`boolean`* | Wether or not to parse argument values from `process.argv`. Default is `true`
`env` | *`boolean`* | Which env variable key to use for value lookup. Default is `null`
`camel` | *`boolean`* | If true will also support `camelCase` keys for `id` in argv arguments. Default is `false`
`snake` | *`boolean`* | If true will also support `snake_case` keys for `id` in argv arguments. Default is `false`
`kebab` | *`boolean`* | If true will also support `kebab-case` keys for `id` in argv arguments. Default is `true`
`type` | *`constructor\|function`* | If set, after the value has been resolved it will attempt to coerce to `arg.type`. If a constructor it will use `new type(val)` otherwise just `type(val)`. Default is `undefined`
`enum` | *`array\|any`* | If set, will attempt to validate against this value. Can be an array of possible values or a single value. Default is `undefined`.
`required` | *`boolean`* | If true will create an error if value is `undefined`. Default is `false`
`value` | *`any`* | Value of the argument. Default is `undefined`
`default` | *`any`* | Which value to use as the default for specified argument. Default is `undefined`
`_keys` | *`array`* | List of keys to use for argument name lookup in argv. This is generated automatically. Default is `[]`
`_errors` | *`array`* | List of error messages generated from parsing this argument. This is generated automatically. Default is `[]`
`parseUndefined` | *`boolean`* | If false will ignore undefined values when attempting to parse to native and/or custom types. Default is `true`
`warn` | *`boolean`* | If true will write errors to `stderr` for missing required fields and invalid enum values. Default is `false`
`throw` | *`boolean`* | If true will throw errors on missing required fields and invalid enum values. Default is `false`
`nativeType` | *`boolean`* | If `true`, will attempt to coerce values to native types if possible. Default is `true`

### Methods
Name | Description
-----|------------
`Arg(opts)` | Low level args class for creating a custom argument instance
`Parser(opts)` | Low level args class for creating a custom parser instance
`resolve(args, opts, locals)` | Parse arguments with specified opts and locals options

## Examples
```javascript
process.env.PROJECT='APP1';
process.env.HOST='app1.net';
process.env.PORT=8080;

let args = [
    {
        id: 'project',
        type: String,
        env: 'PROJECT'
    },
    {
        id: 'host',
        alias: 'h',
        type: String,
        env: 'HOST'
    },
    {
        id: 'port',
        alias: 'p',
        type: String,
        env: 'PORT'
    }
];

Arg.resolve(args);

// {
//     project: 'APP1',
//     host: 'app1.net',
//     port: 8080
// }

```

## Testing
Testing is currently run using mocha and chai. To execute tests just run `npm run test`. To generate unit test coverage reports just run `npm run coverage`

## Contact
If you have any questions feel free to get in touch
