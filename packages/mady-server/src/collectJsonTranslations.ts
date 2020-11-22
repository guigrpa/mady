// @flow

import { mainStory, chalk } from 'storyboard';
import type { Keys, Translation } from './types';

const STR = 'mady-compile';

// =============================================
// Main
// =============================================
const collectJsonTranslations = ({
  lang,
  keys,
  translations,
}: {
  lang: string;
  keys: Keys;
  translations: Translation[];
}) => {
  const prefix = `${chalk.magenta.bold(lang)}`;
  mainStory.info(STR, `${prefix} Preparing translations for generic JSON...`);
  const finalTranslations: Record<string, string> = {};
  translations.forEach((translation) => {
    const key = keys[translation.keyId];
    if (!key) return;
    const { context, text } = key;
    const id = context ? `${context}_${text}` : text;
    finalTranslations[id] = translation.translation;
  });
  return finalTranslations;
};

// =============================================
// Public
// =============================================
export default collectJsonTranslations;
