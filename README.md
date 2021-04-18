# Args
Parse arguments from argv, env variables, and locals

Features:
* Easy to use
* Parse arguments from argv, env variables, and locals
* Coerce to native and/or specified type (class or factory function)
* Supports defaults and aliases
* Supports multiple key formats (snake, camel, kebab)
* Error handling options
* Supports positional and sub process (--) arguments
* Supports enums

## About
I needed a better way to parse application arguments across a variety of interfaces. It's simple enough if you build only a node api, but what if you want to expose a cli component as well? Now you have to worry about parsing argv options and types from multiple formats. What if you wanted to expose configuration for the same options via env variables? It starts to become a complicated mess of parsing values and remembering order, precidence, and types.

This package aims to take care of all that for you. Simply define your arguments in a declarative way whether you want env variables, argv variables, or local variables and it will resolve all the options and return a single object. You can request specific types by providing classes or factory functions, you can set defaults, and you can specify required-ness and how to handle errors.

## Usage
Add args as a dependency for your app and install via npm
```
npm install @danmasta/args --save
```
Require the package in your app
```javascript
const args = require('@danmasta/args');
```

### Options
name | type | description
-----|------|------------
`pos` | *`boolean`* | If `true` any positional arguments from argv will be added to output at `_`. Default is `true`
`sub` | *`boolean`* | If `true` any sub-process arguments from argv will be added to output at `--`. Default is `true`
`defaults` | *`object`* | Default option values to set for all arguments. Default is `null`

### Methods
name | description
-----|------------
`resolve(locals)` | Resolve argument values with optionanl local overrides


### Arguments
Arguments can be configured with the following options:
name | type | description
-----|------|------------
`id` | *`string`* | This is used for initial value lookup from argv. It is also used as the output key in resolved options. Default is `undefined`
`description` | *`string`* | Description for the argument. Default is `undefined`
`alias` | *`string`* | Which alias key to use for argv arguments. Default is `undefined`
`argv` | *`boolean`* | Whether or not to parse argument values from `process.argv`. Default is `true`
`env` | *`boolean`* | Which env variable key to use for value lookup. Default is `undefined`
`camel` | *`boolean`* | If `true` will also support `camelCase` keys for `id` in argv arguments. Default is `false`
`snake` | *`boolean`* | If `true` will also support `snake_case` keys for `id` in argv arguments. Default is `false`
`kebab` | *`boolean`* | If `true` will also support `kebab-case` keys for `id` in argv arguments. Default is `true`
`type` | *`constructor\|function`* | If set, after the value has been resolved it will attempt to coerce to `arg.type`. If a constructor it will use `new type(val)` otherwise just `type(val)`. Default is `undefined`
`enum` | *`array\|any`* | If set, will attempt to validate against this value. Can be an array of possible values or a single value. Default is `undefined`.
`required` | *`boolean`* | If `true` will create an error if value is `undefined`. Default is `false`
`value` | *`any`* | Value of the argument. Default is `undefined`
`default` | *`any`* | Which value to use as the default for specified argument. Default is `undefined`
`parseUndefined` | *`boolean`* | If `false` will ignore undefined values when attempting to parse to native and/or custom types. Default is `true`
`warn` | *`boolean`* | If `true` will write errors to `stderr` for missing required fields and invalid enum values. Default is `false`
`throw` | *`boolean`* | If `true` will throw errors on missing required fields and invalid enum values. Default is `false`
`nativeType` | *`boolean`* | If `true` will attempt to coerce values to native types if possible. Default is `true`
`nullable` | *`boolean`* | If `true` will allow `undefined` for required fields or enums. Default is `false`

## Examples
```js
const Args = require('@danmasta/args');

process.env.PROJECT='APP';
process.env.HOST='app.net';
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
        type: Number,
        env: 'PORT'
    }
];

let opts = Args(args).resolve();

// {
//     project: 'APP',
//     host: 'app.net',
//     port: 8080
// }

```

## Testing
Testing is currently run using mocha and chai. To execute tests just run `npm run test`. To generate unit test coverage reports just run `npm run coverage`

## Contact
If you have any questions feel free to get in touch
