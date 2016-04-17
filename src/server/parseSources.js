import fs                   from 'fs';
import path                 from 'path';
import { chalk }            from 'storyboard';
import diveSync             from 'diveSync';

const REGEXP_TRANSLATE_CMDS = [
  /_t\s*\(\s*"(.*?)"/g,
  /_t\s*\(\s*'(.*?)'/g,
];

export default function parse({ srcPaths, srcExtensions, story }) {
  const keys = {};
  const diveOptions = { filter: (filePath, fDir) => {
    if (fDir) return true;
    return (srcExtensions.indexOf(path.extname(filePath)) >= 0);
  } };
  const diveProcess = (err, filePath) => {
    const finalFilePath = path.normalize(filePath);
    story.info('parser', `Processing ${chalk.cyan.bold(finalFilePath)}...`);
    const fileContents = fs.readFileSync(finalFilePath);
    for (const re of REGEXP_TRANSLATE_CMDS) {
      let match;
      while ((match = re.exec(fileContents))) {
        const key = match[1];
        const tokens = key.split('_');
        let context;
        let text;
        if (tokens.length >= 2) {
          context = tokens.shift();
          text = tokens.join('_');
        } else {
          context = null;
          text = tokens[0];
        }
        keys[key] = keys[key] || {
          id: key,
          context, text,
          firstUsed: null,
          unusedSince: null,
          sources: [],
        };
        keys[key].sources.push(finalFilePath);
      }
    }
  };
  for (const srcPath of srcPaths) {
    diveSync(srcPath, diveOptions, diveProcess);
  }
  return keys;
}
