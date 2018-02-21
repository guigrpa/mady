// @flow

import MessageFormat from 'messageformat';
import UglifyJS from 'uglify-js';
import { chalk } from 'storyboard';
import type {
  MapOf,
  StoryT,
  InternalKeyT,
  InternalTranslationT,
} from '../common/types';

export default function compileTranslations({
  lang,
  keys,
  translations,
  fAlwaysIncludeKeysWithBraces = true,
  fMinify = false,
  story,
}: {|
  lang: string,
  keys: MapOf<InternalKeyT>,
  translations: Array<InternalTranslationT>,
  fAlwaysIncludeKeysWithBraces: boolean,
  fMinify?: boolean,
  story: StoryT,
|}): string {
  const logPrefix = `Lang ${chalk.magenta.bold(lang)}`;

  story.info('compiler', `${logPrefix} Preparing translations...`);

  // =====================================
  // Prepare messageFormatTranslations and markdownTranslations
  // =====================================
  const messageFormatTranslations = {};
  const markdownTranslations = {};

  // We must always include those keys that are not markdown and
  // include curly braces, even if there is no translation
  if (fAlwaysIncludeKeysWithBraces) {
    Object.keys(keys).forEach(keyId => {
      const key = keys[keyId];
      if (!key.isMarkdown && key.text.indexOf('{') >= 0) {
        messageFormatTranslations[keyId] = keys[keyId].text;
      }
    });
  }

  // Copy non-deleted translations to either messageFormatTranslations
  // or markdownTranslations
  translations.forEach(translation => {
    const { keyId } = translation;
    const key = keys[keyId];
    if (!key || key.unusedSince) return;
    if (key.isMarkdown) {
      markdownTranslations[keyId] = translation.translation;
    } else {
      messageFormatTranslations[keyId] = translation.translation;
    }
  });
  story.debug('compiler', `${logPrefix} Translations prepared`, {
    attach: messageFormatTranslations,
    attachLevel: 'TRACE',
  });

  // =====================================
  // Compile translation function
  // =====================================
  story.info('compiler', `${logPrefix} Precompiling...`);
  const mf = new MessageFormat(lang).setIntlSupport(true);
  const fnMessageFormat = mf.compile(messageFormatTranslations).toString();
  let fnTranslate = `
function anonymous() {
${fnMessageFormat}
}
module.exports = anonymous();
`;
  Object.keys(markdownTranslations).forEach(keyId => {
    fnTranslate += `module.exports['${keyId}'] = function() {
      return ${JSON.stringify(markdownTranslations[keyId])}
    };\n`;
  });
  story.debug('compiler', `${logPrefix} Precompiled`, {
    attach: fnTranslate,
    attachLevel: 'TRACE',
  });

  // =====================================
  // Minify result
  // =====================================
  if (fMinify) {
    story.info('compiler', `${logPrefix} Minifying...`);
    fnTranslate = UglifyJS.minify(fnTranslate, { fromString: true }).code;
    story.debug('compiler', `${logPrefix} Minified`, {
      attach: fnTranslate,
      attachLevel: 'TRACE',
    });
  } else {
    story.info('compiler', `${logPrefix} Skipped minification`);
  }

  return fnTranslate;
}
