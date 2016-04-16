# Mady [![npm version](https://img.shields.io/npm/v/mady.svg)](https://www.npmjs.com/package/mady)

Easy-to-use tool to manage and translate ICU MessageFormat messages

## Installation

```
$ npm install --save-dev mady
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
* Export translations to JS files, for use by the [translate function](#the-translate-function)

Messages in your source files should have the form: `_t('someContext_Once upon a time...')`, where `_t()` is the default name for the translate function (see below), `someContext` is some hint for the translator and `Once upon a time...` is your untranslated [MessageFormat](#messageformat) message.


### The translate function

Using the translate function is similarly straightforward:

```js
import _t from 'mady';
import locales from './locales/es-ES';

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

Mady uses the [messageformat.js](https://github.com/SlexAxton/messageformat.js) library by Alex Sexton, which "supports and extends all parts of the **[ICU MessageFormat]** standard (see the [user guide](http://userguide.icu-project.org/formatparse/messages)), with the exception of the deprecated ChoiceFormat." IMHO, and while it does not solve all the problems in the huge subject of i18n, it is a much more powerful tool than the conventional gettext.


## MIT license

Copyright (c) [Guillermo Grau Panea](https://github.com/guigrpa) 2016

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
