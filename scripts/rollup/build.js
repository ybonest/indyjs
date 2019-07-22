const rollup = require('rollup');
const ncp = require('ncp');
const fs = require('fs');
const rimraf = require('rimraf');
const chalk = require('chalk')

const Bundle = require('./bundles');
const common = require('./common');

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

function copyAsync(source, destination, replace) {
  const transform = transformHOC(replace);

  return new Promise((resolve, reject) => {
    ncp(source, destination, { transform }, function(err) {
      if (err) {
        reject();
        return console.error(err);
      }
      resolve();
    });
  });
}

function replacePackageMain(chunk) {
  if (typeof chunk === 'string') {
    return chunk.replace('index.ts', 'index.js');
  }
}

function deleteBuildPackage(path, callback) {
  rimraf(path, err => {
    if (err) {
      console.log(err);
    } else {
      callback && callback();
    }
  })
}

// copy 其余文件到对应dist中
async function copyRelatedFileToDist(name) {
  await copyAsync(
    `packages/${name}/package.json`,
    `build/dist/${name}/package.json`,
    replacePackageMain
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
    plugins: common.plugins(options)
  };

  for (let type of types) {
    const outputOptions = {
      file: outputBundleNames(type, entry),
      format: outputFormat(type)
    };
    const bundle = await rollup.rollup(inputOptions);
    await bundle.write(outputOptions);
  }
}

async function buildEverything() {
  for (let item of Bundle.bundles) {
    await buildBundles(item);
  }
  await initNpmPackage();
}

deleteBuildPackage('build', buildEverything)