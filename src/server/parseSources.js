import fs                   from 'fs';
import path                 from 'path';
import slash                from 'slash';
import { chalk }            from 'storyboard';
import diveSync             from 'diveSync';
import { utf8ToBase64 }     from '../common/base64';

// const REGEXP_TRANSLATE_CMDS = [
//   /_t\s*\(\s*"(.*?)"/g,
//   /_t\s*\(\s*'(.*?)'/g,
// ];

const getRegexps = msgFunctionNames => {
  const out = [];
  msgFunctionNames.forEach(fnName => {
    const escapedFnName = fnName.replace(/([\$])/g, '\\$1');

    // Looking for something like:
    // * i18n("xk s fjkl")
    // * i18n ( "xk s fjkl")
    // * i18n('xk s fjkl')
    out.push(new RegExp(`${escapedFnName}\\s*\\(\\s*"([\\s\\S]*?)"`, 'gm'));
    out.push(new RegExp(`${escapedFnName}\\s*\\(\\s*'([\\s\\S]*?)'`, 'gm'));
  });
  return out;
};

export default function parse({ srcPaths, srcExtensions, msgFunctionNames, story }) {
  const regexpFunctionNames = getRegexps(msgFunctionNames);
  const keys = {};
  const diveOptions = { filter: (filePath, fDir) => {
    if (fDir) return true;
    return (srcExtensions.indexOf(path.extname(filePath)) >= 0);
  } };
  const diveProcess = (err, filePath) => {
    const finalFilePath = path.normalize(filePath);
    story.info('parser', `Processing ${chalk.cyan.bold(finalFilePath)}...`);
    const fileContents = fs.readFileSync(finalFilePath);
    regexpFunctionNames.forEach(re => {
      let match;
      while ((match = re.exec(fileContents))) {
        const utf8 = match[1];
        const tokens = utf8.split('_');
        let context;
        let text;
        if (tokens.length >= 2) {
          context = tokens.shift();
          text = tokens.join('_');
        } else {
          context = null;
          text = tokens[0];
        }
        const base64 = utf8ToBase64(utf8);
        keys[base64] = keys[base64] || {
          id: base64,
          context, text,
          firstUsed: null,
          unusedSince: null,
          sources: [],
        };
        keys[base64].sources.push(slash(finalFilePath));
      }
    });
  };
  srcPaths.forEach(srcPath => diveSync(srcPath, diveOptions, diveProcess));
  return keys;
}
