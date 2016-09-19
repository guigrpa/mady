import fs from 'fs';
import path from 'path';
import _t from '../translate';

const SUPPORTED_LOCALES = ['en', 'en-US', 'en-GB', 'ca', 'es'];

const addLocaleCode = lang => {
  const langPath = path.join(__dirname, `${lang}.js`);
  const localeCode = fs.readFileSync(langPath, 'utf8');
  _t.addLocaleCode(lang, localeCode);
};

const reactIntlMessages = {};

const addAllLocales = () => {
  /* eslint-disable global-require */
  _t.addLocales('en', require('./en'));
  _t.addLocales('en-US', require('./en-US'));
  _t.addLocales('en-GB', require('./en-GB'));
  _t.addLocales('ca', require('./ca'));
  _t.addLocales('es', require('./es'));
  /* eslint-enable global-require */

  SUPPORTED_LOCALES.forEach(addLocaleCode);
  SUPPORTED_LOCALES.forEach(lang => {
    try {
      const reactIntlPath = path.join(__dirname, `${lang}.reactIntl.json`);
      reactIntlMessages[lang] = JSON.parse(fs.readFileSync(reactIntlPath, 'utf8'));
    } catch (err) { /* ignore */ }
  });
};

const getReactIntlMessages = lang => reactIntlMessages[lang];

// =======================================
// Public API
// =======================================
export default addAllLocales;

export {
  SUPPORTED_LOCALES,
  getReactIntlMessages,
};
