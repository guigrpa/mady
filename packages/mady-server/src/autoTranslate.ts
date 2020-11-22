/* eslint-disable no-await-in-loop */

import fetch from 'isomorphic-fetch';
import querystring from 'querystring';
import googleTranslateToken from 'google-translate-token';
import { mainStory } from 'storyboard';

type Options = {
  languageCodeFrom?: string;
  languageCodeTo: string;
};

const GOOGLE_TRANSLATE_URL = 'https://translate.google.com/translate_a/single';

// =============================================
// Main
// =============================================
// Split text to be translated so that Markdown code blocks are kept as is
const translate = async (text: string, options: Options) => {
  const segments = text.split(/(\s*```[\s\S]*```\s*)/gm);
  const out = [];
  for (let i = 0; i < segments.length; i += 1) {
    const segment = segments[i];
    out[i] = i % 2 ? segment : await _translate(segment, options);
    if (out[i] == null) return null;
  }
  return out.join('');
};

// Actual translation function
const _translate = async (
  text: string,
  { languageCodeFrom, languageCodeTo }: Options
): Promise<string | null> => {
  try {
    // Get token
    const googleToken = await googleTranslateToken.get(text);
    if (!googleToken) return null;

    // Build query
    const query: Record<string, any> = {
      client: 'gtx',
      sl: languageCodeFrom || 'auto',
      tl: languageCodeTo,
      hl: languageCodeTo,
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
export default translate;
