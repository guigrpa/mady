import { chalk }            from 'storyboard';

export default function collectJsonTranslations({
  lang,
  keys,
  translations,
  story,
}) {
  const logPrefix = `Lang ${chalk.magenta.bold(lang)}`;

  story.info('compiler', `${logPrefix} Preparing translations for generic JSON...`);
  const finalTranslations = {};
  translations.forEach((translation) => {
    const key = keys[translation.keyId];
    if (!key) return;
    const { context, text } = key;
    const id = context ? `${context}_${text}` : text;
    finalTranslations[id] = translation.translation;
  });
  return finalTranslations;
}
