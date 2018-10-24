/* eslint-disable */

const fs = require('fs-extra');

const sufix = process.argv[2];
const inPath = '.nyc_output/coverage-final.json';
const outPath = `.nyc_tmp/coverage-${sufix}.json`;

const contents = JSON.parse(fs.readFileSync(inPath, 'utf8'));
Object.keys(contents).forEach(key => {
  if (contents[key].data) {
    contents[key] = contents[key].data;
  }
})

fs.writeFileSync(outPath, JSON.stringify(contents), 'utf8');
fs.removeSync(inPath);
