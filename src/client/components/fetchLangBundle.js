/* eslint-disable global-require, import/no-dynamic-require */
const fetchLangBundle = (lang, cb) =>
  require(`bundle!../../locales/${lang}.js`)(cb);

export default fetchLangBundle;
