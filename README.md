# Easy BEM

Easy and much friendly API for [@bem/naming](https://github.com/bem-sdk/bem-naming) package.

[![NPM Status][npm-img]][npm]
[![Travis Status][test-img]][travis]
[![Dependency Status][dependency-img]][david]

[npm]:          https://www.npmjs.org/package/easy-bem-naming
[npm-img]:      https://img.shields.io/npm/v/easy-bem-naming.svg

[travis]:       https://travis-ci.org/awingradov/easy-bem-naming
[test-img]:     https://img.shields.io/travis/awingoradov/easy-bem-naming/master.svg

[david]:          https://david-dm.org/awingradov/easy-bem-naming
[dependency-img]: http://img.shields.io/david/awingradov/easy-bem-naming.svg

# Usage

> npm i -S easy-bem-naming

``` js
const b = require('easy-bem-naming')();

b('block') == 'block';
b('block').e('elem') == 'block__elem';

b('block').m({ m: 'v', disabled: true }) == 'block block_m_v block_disabled';
b('block').e('elem').m({ m: 'v', disabled: true }) == 'block__elem block__elem_m_v block__elem_disabled';

// any order of methods
b('block').m({ m: 'v' }).e('elem').m({ disabled: true }) == 'block__elem block__elem_m_v block__elem_disabled';

// simple mixes
b('block').mix('mixed-block', b('mixed').e('elem')) == 'block mixed-block mixed__elem';

// nested mixes
b('block').mix('mixed-block', b('mixed').e('elem').mix(b('nested-mix'))) == 'block mixed-block mixed__elem nested-mix';

// different namings
const rb = require('easy-bem-naming')('react');
const hb = require('easy-bem-naming')('two-dashes');

rb('Block').e('Elem') == 'Block-Elem';
hb('block').m({ m: 'v', disabled: true }) == 'block block--m_v block--disabled';
```

### License [MIT](https://en.wikipedia.org/wiki/MIT_License)
