const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');



function plugins(options) {
  return [resolve({ external: options.external }), commonjs(), babel()];
}

module.exports = {
  plugins
};
