import MessageFormat        from 'messageformat';
import UglifyJS             from 'uglify-js';
import { chalk }            from 'storyboard';

export default function compileTranslations({
  lang,
  translations,
  story,
}) {
  const logPrefix = `Lang ${chalk.magenta.bold(lang)}`;

  story.info('compiler', `${logPrefix} Preparing translations...`);
  const finalTranslations = {};
  Object.keys(translations).forEach(key => {
    const o = translations[key];
    finalTranslations[o.keyId] = o.translation;
  });
  story.debug('compiler', 'Translations prepared', { attach: finalTranslations });

  story.info('compiler', `${logPrefix} Precompiling...`);
  const mf = new MessageFormat(lang);
  let fnTranslate = mf.compile(finalTranslations).toString();
  fnTranslate += ';\nmodule.exports = anonymous();\n';
  story.debug('compiler', 'Precompiled', { attach: fnTranslate });

  story.info('compiler', `${logPrefix} Minifying...`);
  fnTranslate = UglifyJS.minify(fnTranslate, { fromString: true }).code;
  story.debug('compiler', 'Minified', { attach: fnTranslate });

  return fnTranslate;
}
