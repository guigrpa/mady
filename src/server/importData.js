import fs                   from 'fs';
import path                 from 'path';
import timm                 from 'timm';
import { chalk }            from 'storyboard';
import diveSync             from 'diveSync';
import uuid                 from 'node-uuid';

function duplicatedTranslation(translations, newKeyId, newLang, newTranslation) {
  let fFound = false;
  const ids = Object.keys(translations);
  for (const id of ids) {
    const { keyId, lang, translation } = translations[id];
    if (newKeyId === keyId && newLang === lang && newTranslation === translation) {
      fFound = true;
      break;
    }
  }
  return fFound;
}

export function importV0({ langs, keys, translations, dir, story }) {
  let outK = keys;
  let outT = translations;
  let outLangs = langs;
  const diveOptions = {
    filter: (filePath, fDir) => fDir || path.extname(filePath) === '.json',
  };
  let totNewK = 0;
  let totNewT = 0;
  const diveProcess = (err, filePath) => {
    const finalFilePath = path.normalize(filePath);
    story.info('importV0', `Processing ${chalk.cyan.bold(finalFilePath)}...`);
    const lang = path.basename(filePath, '.json').replace(/_/gi, '-');
    if (outLangs.indexOf(lang) < 0) {
      outLangs = timm.addLast(outLangs, lang);
    }
    const js = JSON.parse(fs.readFileSync(finalFilePath));
    let numNewK = 0;
    let numNewT = 0;
    Object.keys(js).forEach(keyId => {
      const newTranslation = js[keyId];
      const {
        fTranslated,
        context, original: text, translation,
        firstUsed, unusedSince, sources
      } = newTranslation;

      // Add key if new
      if (!outK[keyId]) {
        outK = timm.set(outK, keyId, {
          id: keyId,
          context, text,
          firstUsed, unusedSince,
          sources,
        });
        numNewK++;
        totNewK++;
      };

      // Add translation if translated
      if (fTranslated) {
        if (!duplicatedTranslation(translations, keyId, lang, translation)) {
          const translationId = uuid.v4();
          outT = timm.set(outT, translationId, {
            id: translationId,
            lang,
            translation,
            keyId,
          });
          numNewT++;
          totNewT++;
        }
      }
    });
    story.info('importV0', `Lang ${chalk.magenta.bold(lang)}: new keys ${numNewK}, new translations ${numNewT}`);
  };
  diveSync(dir, diveOptions, diveProcess);
  story.info('importV0', `Total: new keys ${totNewK}, new translations ${totNewT}`);
  return { keys: outK, translations: outT, langs: outLangs };
}
