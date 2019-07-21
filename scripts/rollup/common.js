const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

function plugins(options) {
    return [ resolve(), commonjs(), babel() ]
}

module.exports = {
    plugins
}