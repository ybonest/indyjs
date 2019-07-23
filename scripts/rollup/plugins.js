const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const terser = require('rollup-plugin-terser');

const extensions = ['.ts'];

function plugins(options) {
  return [
    resolve({ external: options.external, extensions }),
    commonjs(),
    babel(),
    terser.terser({
      include: [/^.+\.production\.js$/]
    })
  ];
}

module.exports = plugins;
