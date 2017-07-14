const _t = require('./translate');
const locales = require('./locales/es');

_t.setLocales(locales);

// Some examples of strings that will be detected:
/* eslint-disable no-console, max-len */
console.log(_t('tooltip_Convert translations to JavaScript files', { NUM: 1 }));
console.log(
  _t('someContext_{NUM, plural, one{1 hamburger} other{# hamburgers}}', {
    NUM: 1,
  })
);
console.log(
  _t('someContext_{NUM, plural, one{1 hamburger} other{# hamburgers}}', {
    NUM: 2,
  })
);
console.log(_t('someContext_Message with emoji: 🎉'));
/* eslint-enable no-console, max-len */
