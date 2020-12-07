/* eslint-disable no-await-in-loop */

import path from 'path';
import fs from 'fs-extra';
import fetch from 'isomorphic-fetch';
import querystring from 'querystring';
import googleTranslateToken from 'google-translate-token';
import { mainStory, chalk } from 'storyboard';
import debounce from 'lodash/debounce';

const SRC = 'mady-auto';
const GOOGLE_TRANSLATE_URL = 'https://translate.google.com/translate_a/single';
const JSON_OPTIONS = { spaces: 2 };
const { UNIT_TESTING } = process.env;
const DEBOUNCE_SAVE = 2000;

// ==============================================
// Declarations
// ==============================================
let _path: string;
let _cache: Record<string, string> = {};

type Options = {
  localeDir: string;
};

// =============================================
// Main
// =============================================
const init = (options: Options) => {
  _path = path.join(options.localeDir, 'autoTranslations.json');
  mainStory.info(SRC, `Reading file ${chalk.cyan(_path)}...`);
  if (fs.pathExistsSync(_path)) {
    _cache = fs.readJsonSync(_path);
  } else {
    saveAutoTranslations();
  }
};

// =============================================
// Cache
// =============================================
const saveAutoTranslations = () => {
  fs.writeJsonSync(_path, _cache, JSON_OPTIONS);
};
const debouncedSaveAutoTranslations = UNIT_TESTING
  ? saveAutoTranslations
  : debounce(saveAutoTranslations, DEBOUNCE_SAVE);

const translate = async ({ text, lang }: { text: string; lang: string }) => {
  const cacheKey = `${lang}:::::${text}`;
  let translation: string | null = _cache[cacheKey];
  if (translation) return translation;

  // Split text to be translated so that Markdown code blocks are kept as is
  const segments = text.split(/(\s*```[\s\S]*```\s*)/gm);
  const result = [];
  let errored = false;
  for (let i = 0; i < segments.length; i += 1) {
    const segment = segments[i];
    result[i] = i % 2 ? segment : await googleTranslate(segment, lang);
    if (result[i] == null) {
      errored = true;
      break;
    }
  }
  if (errored) return null;
  translation = result.join('');

  _cache[cacheKey] = translation;
  debouncedSaveAutoTranslations();
  return translation;
};

// =============================================
// Translate
// =============================================
const googleTranslate = async (
  text: string,
  toLang: string,
  fromLang = 'auto'
): Promise<string | null> => {
  try {
    // Get token
    const googleToken = await googleTranslateToken.get(text);
    if (!googleToken) return null;

    // Build query
    const query: Record<string, any> = {
      client: 'gtx',
      sl: fromLang || 'auto',
      tl: toLang,
      hl: toLang,
      dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
      ie: 'UTF-8',
      oe: 'UTF-8',
      otf: 1,
      ssel: 0,
      tsel: 0,
      kc: 7,
      q: text,
    };
    query[googleToken.name] = googleToken.value;
    const url = `${GOOGLE_TRANSLATE_URL}?${querystring.stringify(query)}`;
    const result = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const json = await result.json();
    let translation = '';
    json[0].forEach((obj: any) => {
      if (obj[0]) translation += obj[0];
    });
    return translation;
  } catch (err) {
    mainStory.error('google', 'Error translating', { attach: err });
    return null;
  }
};

// =============================================
// Public
// =============================================
export { init, translate };
