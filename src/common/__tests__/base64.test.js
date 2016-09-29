/* eslint-env jest */
import * as base64 from '../base64';

describe('Base64 utilities', () => {
  it('should convert from UTF8 to base64', () => {
    expect(base64.utf8ToBase64('Résumé')).toEqual('UsOpc3Vtw6k=');
  });
  it('should convert from base64 to UTF8', () => {
    expect(base64.base64ToUtf8('UsOpc3Vtw6k=')).toEqual('Résumé');
  });
});
