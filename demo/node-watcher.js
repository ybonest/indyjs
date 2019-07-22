const fs = require('fs');
const filename = process.argv[2];

if (!filename) {
  new Error('A file to watch must be specified');
}

console.log(process.argv);

fs.watch(filename, () => console.log(`${filename} is changed`)); // 监听文件变化

//  node .\src\demo\node-watcher.js .\src\demo\text.txt