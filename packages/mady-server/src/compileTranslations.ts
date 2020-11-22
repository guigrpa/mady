// @flow

import MessageFormat from 'messageformat';
import Terser from 'terser';
import type { Key, Translation } from './types';

// ==============================================
// Main
// ==============================================
const compileTranslations = async ({
  lang,
  keys,
  translations,
  fAlwaysIncludeKeysWithBraces = true,
  fMinify = false,
}: {
  lang: string;
  keys: Record<string, Key>;
  translations: Translation[];
  fAlwaysIncludeKeysWithBraces?: boolean;
  fMinify?: boolean;
}) => {
  // =====================================
  // Prepare messageFormatTranslations and markdownTranslations
  // =====================================
  const messageFormatTranslations: Record<string, string> = {};
  const markdownTranslations: Record<string, string> = {};

  // We must always include those keys that are not markdown and
  // include curly braces, even if there is no translation.
  // These initial translations may be modified later on
  if (fAlwaysIncludeKeysWithBraces) {
    Object.keys(keys).forEach((keyId) => {
      const key = keys[keyId];
      if (!key || key.unusedSince) return;
      if (!key.isMarkdown && key.text.indexOf('{') >= 0) {
        messageFormatTranslations[keyId] = keys[keyId].text;
      }
    });
  }

  // Copy non-deleted translations to either messageFormatTranslations
  // or markdownTranslations
  translations.forEach((translation) => {
    const { keyId } = translation;
    const key = keys[keyId];
    if (!key || key.unusedSince) return;
    if (key.isMarkdown) {
      markdownTranslations[keyId] = translation.translation;
    } else {
      messageFormatTranslations[keyId] = translation.translation;
    }
  });

  // =====================================
  // Compile translation function
  // =====================================
  const mf = new MessageFormat(lang);
  let fnTranslate = mf
    .compile(messageFormatTranslations)
    .toString('module.exports');
  fnTranslate += ';\n';
  Object.keys(markdownTranslations).forEach((keyId) => {
    fnTranslate += `module.exports['${keyId}'] = function() {
      return ${JSON.stringify(markdownTranslations[keyId])}
    };\n`;
  });

  // =====================================
  // Minify result
  // =====================================
  if (fMinify) fnTranslate = (await Terser.minify(fnTranslate)).code as string;

  return fnTranslate;
};

// ==============================================
// Public
// ==============================================
export default compileTranslations;
