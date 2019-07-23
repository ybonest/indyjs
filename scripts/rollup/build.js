const rollup = require('rollup');
const fs = require('fs');
const chalk = require('chalk');  // 为打印信息增加颜色

const Bundle = require('./bundles');
const getPlugins = require('./plugins');
const utils = require('./utils');

const { deleteFiles: deleteBuildPackage, copyFiles: copyAsync } = utils;

function outputBundleNames(bundleType, entry) {
  let basePath = 'build/dist';
  switch (bundleType) {
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
  switch (bundleType) {
    case 'UMD_DEV':
    case 'UMD_PROD':
      return 'umd';
    case 'NODE_DEV':
    case 'NODE_PROD':
      return 'cjs';
  }
}

function transformHOC(replace) {
  return (read, write) => {
    if (replace) {
      read.setEncoding('utf8');
      read.on('data', chunk => {
        chunk = replace(chunk) || chunk;
        write.write(chunk);
        write.end();
      });
    } else {
      read.pipe(write);
    }
  };
}

function replacePackageMain(chunk) {
  if (typeof chunk === 'string') {
    return chunk.replace('index.ts', 'index.js');
  }
}

// copy 其余文件到对应dist中
async function copyRelatedFileToDist(name) {
  await copyAsync(
    `packages/${name}/package.json`,
    `build/dist/${name}/package.json`,
    {
      transform: transformHOC(replacePackageMain)
    }
  );
  await copyAsync(`packages/${name}/README.md`, `build/dist/${name}/README.md`);
  await copyAsync(`packages/${name}/npm`, `build/dist/${name}`);
}

function initNpmPackage() {
  return Promise.resolve(fs.readdirSync('packages').forEach(copyRelatedFileToDist));
}

async function buildBundles(options) {
  const { types, entry, external } = options;
  const inputEntry = require.resolve(entry); // 与yarn的workspaces配合使用，否则默认加载的是node_modules中的包

  const inputOptions = {
    input: inputEntry,
    external: external,
    plugins: getPlugins(options)
  };

  for (let type of types) {
    const log = `${chalk.blueBright(entry)} ${type.toLowerCase()}`;

    const outputOptions = {
      file: outputBundleNames(type, entry),
      format: outputFormat(type)
    };
    try {
      console.log(chalk.bgYellow('BUILDING'), log);
      const bundle = await rollup.rollup(inputOptions);
      await bundle.write(outputOptions);
      console.log(chalk.bgGreen('COMPLETE'), log);
    } catch (error) {
      console.log(chalk.bgRed('FAILED'), log);
      console.error(error);
    }
  }
}

async function buildEverything() {
  for (let item of Bundle.bundles) {
    await buildBundles(item);
  }
  await initNpmPackage();
}

deleteBuildPackage('build', buildEverything);
