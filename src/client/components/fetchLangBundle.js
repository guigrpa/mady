/* eslint-disable global-require */
const fetchLangBundle = (lang, cb) =>
  require(`bundle!../../locales/${lang}.js`)(cb);

export default fetchLangBundle;
