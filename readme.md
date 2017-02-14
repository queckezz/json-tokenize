
# `json-tokenize` [![Build status][travis-image]][travis-url] [![NPM version][version-image]][version-url] [![Dependency Status][david-image]][david-url] [![License][license-image]][license-url] [![Js Standard Style][standard-image]][standard-url]
Splits a [`JSON`](http://jsonapi.org/) string into an annotated list of [tokens](#Tokens).

* Keeps track of a tokens position
* Whitespace significant
* Doesn't validate the correctness of the syntax

**Screenshot - formatted tokens outputted to stdout**

<p align="center">
  <img src="./tokens.png" />
</p>

<sub><a href='./example.js'>View Example</a></sub>

## Installation

```sh
npm install --save json-tokenize
```

Or even better

```sh
yarn add json-tokenize
```

## Import and Usage Example

```js
const tokenize = require('json-tokenize')

const obj = { "test": 1.0 }

tokenize(JSON.stringify(obj))
// ->
[
  { type: 'punctuation',
    position: { lineno: 1, column: 1 },
    raw: '{',
    value: '{' },
  { type: 'whitespace',
    position: { start: [Object], end: [Object] },
    raw: '\n  ',
    value: '\n  ' },
  { type: 'string',
    position: { start: [Object], end: [Object] },
    raw: '"test"',
    value: 'test' },
  { type: 'punctuation',
    position: { lineno: 2, column: 9 },
    raw: ':',
    value: ':' },
  { type: 'whitespace',
    position: { lineno: 2, column: 10 },
    raw: ' ',
    value: ' ' },
  { type: 'number',
    position: { lineno: 2, column: 11 },
    raw: '1',
    value: 1 },
  { type: 'whitespace',
    position: { start: [Object], end: [Object] },
    raw: '\n',
    value: '\n' },
  { type: 'punctuation',
    position: { lineno: 3, column: 1 },
    raw: '}',
    value: '}' }
]
```

## Tokens

* **whitespace** - Allowed white space between the actual relevant tokens.
* **punctuator** - The characters sorrounding your data: `{`, `}`, `[`, `]`, `:` and `,`
* **string** - JSON String
* **number** - JSON Number
* **literal** - `true`, `false` or `null`

## Author

**json-tokenize** © [Fabian Eichenberger](https://github.com/queckezz), Released under the [MIT](./license) License.<br>
Authored and maintained by Fabian Eichenberger with help from contributors ([list](https://github.com/queckezz/json-tokenize/contributors)).

> GitHub [@queckezz](https://github.com/queckezz) · Twitter [@queckezz](https://twitter.com/queckezz)


[travis-image]: https://img.shields.io/travis/queckezz/json-tokenize.svg?style=flat-square
[travis-url]: https://travis-ci.org/queckezz/json-tokenize

[version-image]: https://img.shields.io/npm/v/json-tokenize.svg?style=flat-square
[version-url]: https://npmjs.org/package/json-tokenize

[david-image]: http://img.shields.io/david/queckezz/json-tokenize.svg?style=flat-square
[david-url]: https://david-dm.org/queckezz/json-tokenize

[standard-image]: https://img.shields.io/badge/code-standard-brightgreen.svg?style=flat-square
[standard-url]: https://github.com/feross/standard

[license-image]: http://img.shields.io/npm/l/json-tokenize.svg?style=flat-square
[license-url]: ./license
