import _t from './translate';
import locales from '../locales/es-ES';

_t.setLocales(locales);

// Some examples of strings that will be detected:
/* eslint-disable no-console, max-len */
console.log(_t('exampleContext_Example string'));
console.log(_t('exampleContext_Example string'));
console.log(_t('exampleContext_Example string'));
console.log(_t('exampleContext_Example string'));
console.log(_t('exampleContext_Number of items: {NUM}', { NUM: 5 }));
console.log(_t('exampleContext_{NUM, plural, one{1 hamburger} other{# hamburgers} }', { NUM: 1 }));
console.log(_t('exampleContext_{NUM, plural, one{1 hamburger} other{# hamburgers} }', { NUM: 2 }));
console.log(_t('exampleContext_Extremely long extremely long extremely long extremely long extremely long extremely long extremely long extremely long extremely long extremely long extremely long extremely long extremely long extremely long extremely long extremely long extremely long extremely long string'));
/* eslint-enable no-console, max-len */
