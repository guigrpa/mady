import fs from 'fs';
import path from 'path';
import timm from 'timm';
import { chalk } from 'storyboard';
import diveSync from 'diveSync';
import uuid from 'uuid';
import { utf8ToBase64, base64ToUtf8 } from '../common/base64';

function duplicatedTranslation(
  translations,
  newKeyId,
  newLang,
  newTranslation
) {
  let fFound = false;
  const ids = Object.keys(translations);
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const { keyId, lang, translation } = translations[id];
    if (
      newKeyId === keyId &&
      newLang === lang &&
      newTranslation === translation
    ) {
      fFound = true;
      break;
    }
  }
  return fFound;
}

function importV0({ langs, keys, translations, dir, story }) {
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
    story.info('importData', `Processing ${chalk.cyan.bold(finalFilePath)}...`);
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
        context,
        original: text,
        translation,
        firstUsed,
        unusedSince,
        sources,
      } = newTranslation;

      // Add key if new
      if (!outK[keyId]) {
        outK = timm.set(outK, keyId, {
          id: keyId,
          context,
          text,
          firstUsed,
          unusedSince,
          sources,
        });
        numNewK += 1;
        totNewK += 1;
      }

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
          numNewT += 1;
          totNewT += 1;
        }
      }
    });
    story.info(
      'importData',
      `Lang ${chalk.magenta.bold(
        lang
      )}: new keys ${numNewK}, new translations ${numNewT}`
    );
  };
  diveSync(dir, diveOptions, diveProcess);
  story.info(
    'importData',
    `Total: new keys ${totNewK}, new translations ${totNewT}`
  );
  return { keys: outK, translations: outT, langs: outLangs };
}

// Use base64 keys
function importToV2({ langs, dir, story }) {
  // Import keys
  story.info('importData', 'Processing keys...');
  const keyPath = path.join(dir, 'keys.json');
  const prevKeys = JSON.parse(fs.readFileSync(keyPath));
  const nextKeys = {};
  Object.keys(prevKeys).forEach(id => {
    const keyData = prevKeys[id];
    const nextId = utf8ToBase64(id);
    nextKeys[nextId] = timm.set(keyData, 'id', nextId);
  });
  fs.writeFileSync(keyPath, JSON.stringify(nextKeys, null, '  '), 'utf8');

  // Import translations
  langs.forEach(lang => {
    story.info('importData', `Processing translations: ${lang}...`);
    const translationPath = path.join(dir, `${lang}.json`);
    const translations = JSON.parse(fs.readFileSync(translationPath));
    Object.keys(translations).forEach(id => {
      const translation = translations[id];
      translation.keyId = utf8ToBase64(translation.keyId);
    });
    fs.writeFileSync(
      translationPath,
      JSON.stringify(translations, null, '  '),
      'utf8'
    );
  });
}

// Go back to non-base64 keys
function importToV3({ langs, dir, story }) {
  // Import keys
  story.info('importData', 'Processing keys...');
  const keyPath = path.join(dir, 'keys.json');
  const prevKeys = JSON.parse(fs.readFileSync(keyPath));
  const nextKeys = {};
  Object.keys(prevKeys).forEach(id => {
    const keyData = prevKeys[id];
    const nextId = base64ToUtf8(id);
    nextKeys[nextId] = timm.set(keyData, 'id', nextId);
  });
  fs.writeFileSync(keyPath, JSON.stringify(nextKeys, null, '  '), 'utf8');

  // Import translations
  langs.forEach(lang => {
    story.info('importData', `Processing translations: ${lang}...`);
    const translationPath = path.join(dir, `${lang}.json`);
    const translations = JSON.parse(fs.readFileSync(translationPath));
    Object.keys(translations).forEach(id => {
      const translation = translations[id];
      translation.keyId = base64ToUtf8(translation.keyId);
    });
    fs.writeFileSync(
      translationPath,
      JSON.stringify(translations, null, '  '),
      'utf8'
    );
  });
}

// ==============================================
// Public API
// ==============================================
export { importV0, importToV2, importToV3 };
