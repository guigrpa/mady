# Mady [![npm version](https://img.shields.io/npm/v/mady.svg)](https://www.npmjs.com/package/mady)

**Mady v4 is a total rewrite of the venerable translation tool, dropping a lot of ballast, enabling new use cases and providing a huge performance boost. If you need features that have been removed (notably React Intl support), you can find v3's docs [here](https://github.com/guigrpa/mady/tree/4e4d670bbd853a00d0981f537a898f55680ee30d). Otherwise, moving to v4 should be very straightforward -- see more details in the [migration guide](./CHANGELOG.md).**

An easy-to-use tool to manage and translate ICU MessageFormat messages.

![Mady UI](https://raw.githubusercontent.com/guigrpa/mady/master/docs/01-ui-v2.png)

Although not depicted above, MessageFormat messages are supported. Please refer to [this guide](https://messageformat.github.io/guide/) for more details on the syntax, but here is an example:

```js
console.log(
  _t('someContext_{NUM, plural, one{1 hamburger} other{# hamburgers}}', {
    NUM: 1,
  })
);
// 1 hamburguesa
console.log(
  _t('someContext_{NUM, plural, one{1 hamburger} other{# hamburgers}}', {
    NUM: 2,
  })
);
// 2 hamburguesas
```

MessageFormat is not only for translation! Even if you only use English, you may need MessageFormat for gender, pluralisation and even regionalisation (_regionalization_).

## Why?

- **Easy-to-use tool for parsing source files, editing translations, comparing languages side-by-side, filtering missing/dubious/unused translations, and compiling to (optionally minified) JavaScript modules**.
- A **translation function** to run the compiled language modules.
- **Multi-user support**: multiple users can work simultaneously, with changes pushed in real time to all of them.
- **Automatic translations**: Mady suggests automatic translations as soon as new messages or languages are added to its database.
- **Ultra-fast parsing**: Mady watches your application folders and parses files as they are added, changed or deleted, then pushes all changes to the connected users.
- **MessageFormat messages**: while it does not solve all the problems in the huge field of i18n, MessageFormat is a much more powerful tool than the conventional gettext (IMHO).
- **Full UNICODE support**: messages and translations can include any UNICODE character. In other words, you can now translate 👍 (en) as 👏 (es-ES) and then 💃 (es-ES-andalusia)!
- **BCP47 support and locale inheritance**: fetch missing translations from parent/child languages or dialects, and even sibling languages (other regions) as a last resort.
- **Dubious translations**: flag some translations to revisit them later on.
- **Modular architecture**, allowing advanced users to embed Mady as a translation tool in broader-scope tools (CMS, anyone?).
- **TypeScript support**.

## Installation

```
$ npm install --save mady
$ npm install --save-dev mady-server
```

## Usage

There are two main parts in Mady: the web-based translation app and the translation function. The webapp is only needed during development (for the extraction, translation and management of messages and translations), whereas the translation function can be used in your own application, and hence in production as well.

### The translation app

Access the translation app by running `npx mady` (run `npx mady --help` for more options, including changing the source paths). Mady will automatically launch in your default browser (default URL: http://localhost:8080). From the web application, you can:

- Update the message database with new messages extracted from your source files
- Translate your messages to the different supported languages
- Mark translations as dubious
- Apply filters: untranslated or unused messages, dubious translations, etc.
- [Automatically] export translations to JS files with optional minification, for use by the [translation function](#the-translation-function) and other integrations

Messages in your source files might have the form: `_t('someContext_Once upon a time...')` (single or double quotes are supported), where `_t()` is the default name for the translation function (see below), `someContext` is some hint for the translator and `Once upon a time...` is your untranslated [MessageFormat](#messageformat) message.

Mady's configuration specifies key aspects such as the translation languages. Here is the default configuration (you'll find it under <project>/locales/config.json):

```json
{
  "srcPaths": ["src"],
  "srcExtensions": [".js", ".jsx", ".ts", ".tsx"],
  "langs": ["en"],
  "originalLang": "en",
  "msgFunctionNames": ["_t"],
  "msgRegexps": [],
  "fMinify": false,
  "fJsOutput": true
}
```

### The translation function

Using the translation function is similarly straightforward:

```js
import _t from 'mady';
import locales from './locales/es';

_t.setLocales(locales);

console.log(_t('someContext_Once upon a time...'));
// Érase una vez...
console.log(_t('someContext_Number of items: {NUM}', { NUM: 5 }));
// Número de ítems: 5
console.log(
  _t('someContext_{NUM, plural, one{1 hamburger} other{# hamburgers} }', {
    NUM: 1,
  })
);
// 1 hamburguesa
console.log(
  _t('someContext_{NUM, plural, one{1 hamburger} other{# hamburgers} }', {
    NUM: 2,
  })
);
// 2 hamburguesas
```

Alternatively, you can set up locales beforehand and then activate one or the other. In case the requested variant is not available, its closest BCP47 parent is enabled:

```js
import _t from 'mady';
import locales from './locales/es';

_t.addLocales('es', locales);
const lang = _t.setLocales('es-US');
// returns 'es', since we don't have the American Spanish variant

const lang = _t.setLocales('fr');
// does nothing, since we have no French translations
```

## BCP47 and translation fallbacks

Mady "fills in the gaps" when **building** translation modules (`{lang.js}`). In other words, when you don't provide a translation for message X for a particular language (e.g. `es-ES`), it will look for suitable fallback translations in related languages:

- Parent languages (e.g. `es`)
- Sibling languages (e.g. `es-MX`)
- Children languages (e.g. `es-ES-andalusia`)

If you use Mady's translation function and it cannot find a suitable translation, it will just take the message key (e.g. `someContext_Untranslated message`), remove the context prefix (`someContext_`) and use it as a last-resort fallback.

## The locales folder

You can find the following files in the locales folder (`./locales` by default):

- A configuration file: `config.json`
- A message file: `keys.json`
- A raw translation file per language, e.g. `fr.json` (this is the one you edit with the web application)
- A compiled translation module (`fr.js`), generated automatically.

## MessageFormat

Mady uses the [messageformat.js](https://github.com/SlexAxton/messageformat.js) library by Alex Sexton, which "supports and extends all parts of the **ICU MessageFormat** standard (see the [user guide](http://userguide.icu-project.org/formatparse/messages)), with the exception of the deprecated ChoiceFormat." IMHO, and while it does not solve all the problems in the huge field of i18n, it is a much more powerful tool than the conventional gettext.

Some examples of MessageFormat messages are given above ([more here](https://messageformat.github.io/guide/)), but this does not even scratch the surface of what is enabled by this standard.

## [Changelog](https://github.com/guigrpa/mady/blob/master/CHANGELOG.md)

## Why _Mady_?

This library is named after my cousin, a brilliant person with an extraordinary talent for languages. I thank her for teaching me English when I was a little child.

## License (MIT)

Copyright (c) [Guillermo Grau Panea](https://github.com/guigrpa) 2016-2020

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
