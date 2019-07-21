const rollup = require('rollup');
const path = require('path');
const Bundle = require('./bundles');
const common = require('./common');

function outputBundleNames(bundleType, entry) {
    let basePath = 'build/dist'
    switch(bundleType) {
        case 'UMD_DEV':
            return `${basePath}/${entry}/umd/${entry}.development.js`;
        case 'UMD_PROD':
            return `${basePath}/${entry}/umd/${entry}.production.js`;
        case 'NODE_DEV':
            return `${basePath}/${entry}/cjs/${entry}.development.js`;
        case 'NODE_PROD':
            return `${basePath}/${entry}/cjs/${entry}.production.js`;
    }
}

function outputFormat(bundleType) {
    switch(bundleType) {
        case 'UMD_DEV':
        case 'UMD_PROD':
            return 'umd';
        case 'NODE_DEV':
        case 'NODE_PROD':
            return 'cjs';
    }
}



async function buildBundles(options) {
    const { types, entry, external } = options;
    const test = require.resolve(entry);

    console.log(test, "(((")
    const inputFiles = path.join(__dirname, '../../packages', entry, 'index.ts');
    const inputOptions = {
        input: inputFiles,
        external: external,
        plugins: common.plugins(options),
    };

    for(let type of types) {
        const outputOptions = {
            file: outputBundleNames(type, entry),
            format: outputFormat(type)
        }
        const bundle = await rollup.rollup(inputOptions);
    
        await bundle.write(outputOptions);
    }
}

async function buildEverything() {
    for(let item of Bundle.bundles) {
        await buildBundles(item);
    }
}

buildEverything()