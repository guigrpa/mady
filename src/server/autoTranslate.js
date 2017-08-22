// @flow

/* eslint-global fetch */

import 'isomorphic-fetch';
import querystring from 'querystring';
import googleTranslateToken from 'google-translate-token';
import { mainStory } from 'storyboard';

type Options = {|
  languageCodeFrom?: string,
  languageCodeTo: string,
  tokenName?: string,
  tokenValue?: string,
|};

const GOOGLE_TRANSLATE_URL = 'https://translate.google.com/translate_a/single';

const translate = async (
  text: string,
  { languageCodeFrom, languageCodeTo, tokenName, tokenValue }: Options
) => {
  try {
    // Get token
    let googleToken;
    if (tokenName && tokenValue) {
      googleToken = { name: tokenName, value: tokenValue };
    }
    if (!googleToken && process.env.MADY_DEBUG_GOOGLE_TRANSLATE) {
      googleToken = await googleTranslateToken.get(text);
    }
    if (!googleToken) return null;

    // Build query
    const query = {
      client: 't',
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
    json[0].forEach(obj => {
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
