import MessageFormat        from 'messageformat';
import UglifyJS             from 'uglify-js';
import { chalk }            from 'storyboard';

export default function compileTranslations({
  lang,
  keys,
  translations,
  fMinify = false,
  story,
}) {
  const logPrefix = `Lang ${chalk.magenta.bold(lang)}`;

  story.info('compiler', `${logPrefix} Preparing translations...`);
  const finalTranslations = {};
  // We must always include those keys using curly braces, even if there is no translation
  Object.keys(keys).forEach(keyId => {
    if (keyId.indexOf('{') >= 0) {
      finalTranslations[keyId] = keys[keyId].text;
    }
  });
  Object.keys(translations).forEach(translationId => {
    const o = translations[translationId];
    finalTranslations[o.keyId] = o.translation;
  });
  story.debug('compiler', `${logPrefix} Translations prepared`, {
    attach: finalTranslations,
    attachLevel: 'TRACE',
  });

  story.info('compiler', `${logPrefix} Precompiling...`);
  const mf = new MessageFormat(lang);
  let fnTranslate = mf.compile(finalTranslations).toString();
  fnTranslate += ';\nmodule.exports = anonymous();\n';
  story.debug('compiler', `${logPrefix} Precompiled`, {
    attach: fnTranslate,
    attachLevel: 'TRACE',
  });

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
