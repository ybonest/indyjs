'use strict';

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cjs/element.production.js')
} else {
    module.exports = require('./cjs/element.development.js')
}