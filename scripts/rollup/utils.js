const rimraf = require('rimraf'); // 删除文件
const ncp = require('ncp'); // copy文件至其他目录

/**
 * 删除文件
 * @param {*} path 文件路径
 * @param {*} callback 
 */
function deleteFiles(path, callback) {
  rimraf(path, err => {
    if (err) {
      console.log(err);
    } else {
      callback && callback();
    }
  });
}

/**
 * 复制文件到目标文件夹
 * @param {*} source 文件源
 * @param {*} destination 目标文件
 * @param {*} options ncp options配置
 */
function copyFiles(source, destination, options = {}) {
  return new Promise((resolve, reject) => {
    ncp(source, destination, options, function(err) {
      if (err) {
        reject();
        return console.error(err);
      }
      resolve();
    });
  });
}

module.exports = {
  deleteFiles,
  copyFiles
}