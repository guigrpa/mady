# Mady [![npm version](https://img.shields.io/npm/v/mady.svg)](https://www.npmjs.com/package/mady)

An easy-to-use tool to manage and translate ICU MessageFormat messages.

![Mady UI](https://raw.githubusercontent.com/guigrpa/mady/master/docs/01-ui.png)

*Yes, it's Mady's view of herself!* :open_mouth: For more details on the MessageFormat syntax (*hamburger* examples above), [see the MessageFormat guide](https://messageformat.github.io/guide/):

```js
console.log(_t("someContext_{NUM, plural, one{1 hamburger} other{# hamburgers}}", { NUM: 1 }));
// 1 hamburguesa
console.log(_t("someContext_{NUM, plural, one{1 hamburger} other{# hamburgers}}", { NUM: 2 }));
// 2 hamburguesas
```

Remember: this is not only for translation! Even if you only use English, you may need MessageFormat for gender and pluralization.

## Why?

* **MessageFormat messages**: while it does not solve all the problems in the huge field of i18n, MessageFormat is a much more powerful tool than the conventional gettext (IMHO).
* **Full UNICODE support**: messages and translations can include any UNICODE character. In other words, you can now translate 👍 (en) as 👏 (es-ES) and then 💃 (es-ES-andalusia)!
* Use it as a development tool in your project: an **easy-to-use UI** that allows **parsing source files, adding languages and translations, comparing translations side-by-side, and compiling to (optionally minified) JavaScript modules**.
* Use it as a library: a no-frills translate function to run the compiled language modules.

## Installation

```
$ npm install --save mady
```


## Usage

There are two main parts in Mady: the web-based translation app and the translate function.


### The translation app

Access the translation app by running:

```bash
$ ./node_modules/.bin/mady
```

Or just add the following line to your `package.json`:

```json
"scripts": {
    "translate": "mady"
}
```

and run `npm run translate`.

The first time you run it, Mady will ask you for some additional information: the path to your locales folder and a default port for the application. Now open Mady's URL in your browser (http://localhost:8080 by default) and there you go!

From the web application, you can:

* Update the key database with new keys extracted from your source files
* Configure your languages, source paths, file extensions, etc.
* Translate your keys to the different supported languages
* [Automatically] export translations to JS files, for use by the [translate function](#the-translate-function)

Messages in your source files should have the form: `_t('someContext_Once upon a time...')` (single or double quotes are supported), where `_t()` is the default name for the translate function (see below), `someContext` is some hint for the translator and `Once upon a time...` is your untranslated [MessageFormat](#messageformat) message.

Configuration looks like this:

![Mady config](https://raw.githubusercontent.com/guigrpa/mady/master/docs/02-config.png)

You can see the UI in English, Spanish and Catalan at the moment. Mady *eats her own dog food*.


### The translate function

Using the translate function is similarly straightforward:

```js
import _t from 'mady';
import locales from './locales/es';

_t.setLocales(locales);

console.log(_t('someContext_Once upon a time...'));
// Érase una vez...
console.log(_t('someContext_Number of items: {NUM}', { NUM: 5 }));
// Número de ítems: 5
console.log(_t("someContext_{NUM, plural, one{1 hamburger} other{# hamburgers} }", { NUM: 1 }));
// 1 hamburguesa
console.log(_t("someContext_{NUM, plural, one{1 hamburger} other{# hamburgers} }", { NUM: 2 }));
// 2 hamburguesas
```


## MessageFormat

Mady uses the [messageformat.js](https://github.com/SlexAxton/messageformat.js) library by Alex Sexton, which "supports and extends all parts of the **ICU MessageFormat** standard (see the [user guide](http://userguide.icu-project.org/formatparse/messages)), with the exception of the deprecated ChoiceFormat." IMHO, and while it does not solve all the problems in the huge field of i18n, it is a much more powerful tool than the conventional gettext.

Some examples of MessageFormat messages are given above ([more here](https://messageformat.github.io/guide/)), but this does not even scratch the surface of what is enabled by this standard.


## Internals

Mady is built with [React](https://facebook.github.io/react/) and [Relay](https://facebook.github.io/relay/).


## [Changelog](https://github.com/guigrpa/mady/blob/master/CHANGELOG.md)


## Why *Mady*?

This library is named after my cousin, a brilliant person with an extraordinary talent for languages. I thank her for teaching me English when I was a little child.


## License (MIT)

Copyright (c) [Guillermo Grau Panea](https://github.com/guigrpa) 2016

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
