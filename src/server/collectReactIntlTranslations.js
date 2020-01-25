// @flow

import { chalk } from 'storyboard';
import type {
  MapOf,
  StoryT,
  InternalKeyT,
  InternalTranslationT,
} from '../common/types';

export default function collectReactIntlTranslations({
  originalLang,
  lang,
  keys,
  translations,
  story,
}: {|
  originalLang: string,
  lang: string,
  keys: MapOf<InternalKeyT>,
  translations: Array<InternalTranslationT>,
  story: StoryT,
|}): MapOf<InternalTranslationT> {
  const logPrefix = `Lang ${chalk.magenta.bold(lang)}`;

  story.info(
    'compiler',
    `${logPrefix} Preparing translations for React Intl...`
  );
  const finalTranslations = {};
  // We must always include those keys using curly braces, even if there is no translation
  Object.keys(keys).forEach(keyId => {
    const key = keys[keyId];
    const { reactIntlId } = key;
    if (!reactIntlId) return;
    if (key.text.indexOf('{') >= 0 || lang === originalLang) {
      finalTranslations[reactIntlId] = key.text;
    }
  });
  translations.forEach(translation => {
    const key = keys[translation.keyId];
    if (!key) return;
    const { reactIntlId } = key;
    if (!reactIntlId) return;
    finalTranslations[reactIntlId] = translation.translation;
  });
  return finalTranslations;
}
