import fs from 'fs';
import path from 'path';
import _t from '../translate';

const SUPPORTED_LOCALES = ['en', 'en-US', 'en-GB', 'ca', 'es'];

const addLocaleCode = (lang) => {
  const langPath = path.join(__dirname, `../locales/${lang}.js`);
  const localeCode = fs.readFileSync(langPath, 'utf8');
  _t.addLocaleCode(lang, localeCode);
};

const reactIntlMessages = {};

const addAllLocales = () => {
  /* eslint-disable global-require */
  _t.addLocales('en', require('../locales/en'));
  _t.addLocales('en-US', require('../locales/en-US'));
  _t.addLocales('en-GB', require('../locales/en-GB'));
  _t.addLocales('ca', require('../locales/ca'));
  _t.addLocales('es', require('../locales/es'));
  /* eslint-enable global-require */

  SUPPORTED_LOCALES.forEach(addLocaleCode);
  SUPPORTED_LOCALES.forEach((lang) => {
    try {
      const reactIntlPath = path.join(__dirname, `${lang}.reactIntl.json`);
      reactIntlMessages[lang] = JSON.parse(fs.readFileSync(reactIntlPath, 'utf8'));
    } catch (err) { /* ignore */ }
  });
};

const getReactIntlMessages = (lang) => reactIntlMessages[lang];

// =======================================
// Public API
// =======================================
export default addAllLocales;

export {
  SUPPORTED_LOCALES,
  getReactIntlMessages,
};
