/* eslint-env jest */
import _t from '../src/translate';

describe('Translate library', () => {
  describe('When an unknown key is provided', () => {
    it('leaves it as is if it has no context', () => {
      expect(_t('Hello')).toBe('Hello');
    });
    it('strips the context prefix out', () => {
      expect(_t('context_Hullo')).toBe('Hullo');
    });
  });
});
