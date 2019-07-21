const rollup = require('rollup');
const path = require('path');
const Bundle = require('./bundles');
const common = require('./common');

async function buildBundles(options) {
    const inputFiles = path.join(__dirname, '../../packages', options.entry, 'index.ts');
    
    const inputOptions = {
        input: inputFiles,
        external: options.external,
        plugins: common.plugins(options),
    };
    const outputOptions = {
        file: `build/dist/${options.entry}.js`,
        format: 'amd'
    }
    const bundle = await rollup.rollup(inputOptions);

    await bundle.write(outputOptions);
}

async function buildEverything() {
    
    for(let item of Bundle.bundles) {
        await buildBundles(item);
    }
}

buildEverything()