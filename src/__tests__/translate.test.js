/* eslint-env jest */
/* eslint-disable quote-props */
import _t from '../translate';

const ES_LOCALES = {
  someContext_Hello: () => 'Hola',
  someContext_Résumé: () => 'Currículum',
  Friend: () => 'Amigo',
};

const ES_MX_LOCALES = {
  someContext_Hello: () => 'Hola',
  Friend: () => 'Cuate',
};

describe('Translate library', () => {
  describe('When an unknown key is provided', () => {
    it('leaves it as is if it has no context', () => {
      expect(_t('Hello')).toBe('Hello');
    });

    it('strips the context prefix out', () => {
      expect(_t('context_Hullo')).toBe('Hullo');
    });
  });

  describe('When setting locale objects directly', () => {
    beforeEach(() => {
      _t.setLocales(ES_LOCALES);
    });

    it('should call the corresponding message function', () => {
      expect(_t('someContext_Hello')).toBe('Hola');
    });

    it('should support any UTF8 key', () => {
      expect(_t('someContext_Résumé')).toBe('Currículum');
    });
  });

  describe('When setting locale objects first, and then choosing which one to use', () => {
    beforeEach(() => {
      _t.setLocales({});
      _t.addLocales('es', ES_LOCALES);
      _t.addLocales('es-MX', ES_MX_LOCALES);
    });

    it('should allow to retrieve locale objects following inheritance', () => {
      expect(_t.getLocales('es')).toEqual({ lang: 'es', result: ES_LOCALES });
      expect(_t.getLocales('es-ES')).toEqual({
        lang: 'es',
        result: ES_LOCALES,
      });
      expect(_t.getLocales('fr')).toEqual({ lang: null, result: undefined });
    });

    it('when the chosen locale exists, it should use it', () => {
      const lang = _t.setLocales('es-MX');
      expect(lang).toBe('es-MX');
      expect(_t('someContext_Hello')).toBe('Hola');
      expect(_t('Friend')).toBe('Cuate');
    });

    it('when a parent of the chosen locale exists, it should use it', () => {
      const lang = _t.setLocales('es-ES');
      expect(lang).toBe('es');
      expect(_t('someContext_Hello')).toBe('Hola');
      expect(_t('Friend')).toBe('Amigo');
    });

    it('when no parent of the chosen locale exists, it should not break', () => {
      const lang = _t.setLocales('fr');
      expect(lang).toBeNull();
      expect(_t('someContext_Hello')).toBe('Hello');
      expect(_t('Friend')).toBe('Friend');
    });
  });

  it('should allow getting the BCP47 of a locale ID', () => {
    expect(_t.getParentBcp47('en-US-Minessotta')).toBe('en-US');
    expect(_t.getParentBcp47('en_US_Minessotta')).toBe('en-US');
    expect(_t.getParentBcp47('en-US')).toBe('en');
    expect(_t.getParentBcp47('en_US')).toBe('en');
    expect(_t.getParentBcp47('en')).toBeNull();
  });

  it('should allow setting and retrieving locale code (for the server side)', () => {
    _t.addLocaleCode('es', 'ES CODE');
    _t.addLocaleCode('es-MX', 'ES-MX CODE');
    expect(_t.getLocaleCode('es')).toEqual({ lang: 'es', result: 'ES CODE' });
    expect(_t.getLocaleCode('es-ES')).toEqual({
      lang: 'es',
      result: 'ES CODE',
    });
    expect(_t.getLocaleCode('fr')).toEqual({ lang: null, result: undefined });
  });
});
