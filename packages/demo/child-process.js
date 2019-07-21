'use strice';

const fs = require('fs');
const path = require('path');
// const spawn = require('child_process').spawn;
const spawn = require('cross-spawn');
const filename = path.join(__dirname, process.argv[2])

// function isWinPlatform() {
//   return /^win/.test(process.platform);
// }

fs.watch(filename, () => {
  const ls = spawn('ls', ['-l', '-h', filename]);
  ls.stdout.pipe(process.stdout);
})