## 3.1.2 (2019-1-25)

* **Client**: bugfix: delete translation if text is cleared.

## 3.1.1 (2019-1-25)

* **Server**:
    * Update auto-translate function (fix `client` query field).

## 3.1.0 (2019-1-21)

* **Server**:
    * Add `--no-watch` CLI option and `noWatch` server-plugin option.
    * Make logs less verbose.
    * Improve Markdown autotranslations (do not translate multi-line code blocks -- between triple backticks).

## 3.0.3 (2018-11-14)

## 3.0.2 (2018-11-14)

* Replace uglify-js with Terser (better-maintained).

## 3.0.1 (2018-11-14)

## 3.0.0 (2018-11-14)

* **General**:
    * Add the possibility to request an auto-translation from the server.
* **Server**:
    * Server plugin: accept `onChange` option, a function that is called whenever locales are compiled.
    * Server plugin: make it compatible with a user that already uses websockets.
* **Client**:
    * Set a maximum row height (except when selected).

## 2.13.0 (2018-10-11)

* Server plugin: accept `otherLocaleDirs` (same as the `--other-dirs` flag described below).

## 2.12.0 (2018-7-20)

* Add `--other-dirs` CLI flag (allows you to include keys and translations from the libs you use in your application, as long as those libs are also using Mady).

## 2.11.1 (2018-3-15)

* Fix Firefox layout.

## 2.11.0 (2018-3-15)

* Add some theming support via URL querystring (try `?theme=bw`).

## 2.10.3 (2018-2-28)

## 2.10.2 (2018-2-28)

## 2.10.1 (2018-2-28)

## 2.10.0 (2018-2-28)

* Add experimental interface to integrate the Mady server in another Express.js server (`lib/serverPlugin`).

## 2.9.0 (2018-2-21)

* Add support for a `getExtraMessages.js` hook (in the locale directory), which allows injecting messages in Mady that do not appear in the source files.
* Add support for **Markdown** messages and translations (≠ MessageFormat messages).
* Add support for **scoped** messages, which produce separate JS output modules (translations are stored in JSON files as always, along with the unscoped message translations).

## 2.8.0 (2017-10-23)

* Remove translations from compiled files if the corresponding key no longer exists or is unused.
* Replace cmd-A shortcut (filter removal) with cmd-shift-A, which causes fewer UX issues.
* Add `originalLang` config option to prevent automatic translations for original language. For the time being, this option can only be modified at the server side.

## 2.7.2, 2.7.3 (2017-8-22)

* Bugfix: fetch automatic translations also when a new language is added (disabled accidentally).

## 2.7.1 (2017-8-22)

* Bugfix: Fix strange behaviour in Production after 3 different key selections — remove `relay-query-lookup-renderer` and SSR (for the time being).

## 2.7.0 (2017-8-22)

* Generate **automatic translations** whenever new messages or languages are added to the database. All automatic translations are automatically flagged as dubious.

## 2.6.0 (2017-8-20)

* Add **watch-based (or *delta*) parsing**: Mady now automatically parses files that are added, changed or removed from your watched folders, and then pushes changes in real time to all connected users. This increases parse times a lot and aims at improving developer workflows.

## 2.5.1 (2017-8-19)

* Fix SSR.

## 2.5.0 (2017-8-19)

* **Multi-user support**: changes by one user are automatically pushed to other users.
* Bugfix: correct handling of keyboard shortcuts in filters (caused by an upstream bug).

## 2.4.0 (July 25, 2017)

* **Add filters**: untranslated or unused messages, fuzzy translations.
* **Performance improvements**.

## 2.3.1 (May 3, 2017)

* Fix missing `buffer` dependency.

## 2.3.0 (May 2, 2017)

* Add React Native compatibility (#9).

## 2.2.0 (March 16, 2017)

* **Flag translations as dubious**.
* Allow selection of message keys.
* Improve usability of Translation help (float instead of inline; hide on hover).

## 2.1.0 (February 2, 2017)

* [Internal] Now built with Webpack 2

## 2.0.0 (October 7, 2016)

* **(Minor) breaking change**: Mady no longer looks for a `.madyrc` file at your project root. This file only contained two parameters (the rest of Mady's configuration being stored in the `<locales>/config.json` file): a port number (which for Mady's purposes is not so important) and the relative path to the locales folder. The relative path should now be passed in with the CLI `--dir` argument, instead of via `.madyrc`.

* [M] **Add [React Intl](https://github.com/yahoo/react-intl) integration**:
  - If Mady finds the babel-core and babel-plugin-react-intl modules (included as `peerDependencies`), it will automatically enable the React Intl integration and extract messages from your `FormattedMessage`/`FormattedHTMLMessage` components and `defineMessages()` calls, as supported by the Babel plugin.
  - Add support for React Intl's `description` field, used to give more context to the translator than the message prefix (e.g. `someContext_A message`)
  - Translation compilation now generates `${lang}.reactIntl.json` files that you can use to bootstrap React Intl
* [M] **Add custom regexp parsing** (#6)
* [M] **Add generic JSON output format**, useful for some integrations (#6)

## 1.6.1 (August 25, 2016)

+ [m] Automatically open Mady's webpage when the server starts
+ [m] Bugfix: prevent click on "copy key" button from getting lost when the user is editing another translation.

## 1.6.0 (August 18, 2016)

* [m] Add `_t.addLocales(lang, locales)` function and `_t.setLocales(lang)` signature: Mady can now keep track of all locales and use parent BCP47 codes when the requested BCP47 is not available.
* [m] Add `_t.addLocaleCode(lang, localeCode)` and `_t.getLocaleCode(desiredLang)` (returning { lang, result }, where the returned `lang` isn't necessarily the same as `desiredLang`). These two are useful for bootstrapping locale code.

## 1.5.0 (August 16, 2016)

* [M] Better **BCP47** support: complete missing translations with those from descendants and ancestors.
  - If you define your languages as `['en-US', 'es']`, you'll get *three* JS files, not two: `en`, `en-US` and `es`.
  - If you define translations for `en`, `en-US` will inherit them, plus the specific `en-US` translations.
  - Translations for a sub-language (e.g. `es-ES`) will flow up to the parent language if it doesn't have a translation for that key. What's more, those translations will also flow down to other sub-languages (e.g. `es-MX`) if the key is missing.

## 1.4.0 (August 1, 2016)

* [M] Allow **Unicode escape sequences** in keys and translations (i.e. emojis, and non-English messages!! -- translations were fine already).
  You can now translate 👍 (en) as 👏 (es-ES) and then 💃 (es-ES-andalusia)
* [M] **Automatic migration** from older DB versions.
* [M] **Add `--recompile` option** to CLI.
* [m] Bug: Fix a case in which removing an item from a list in the settings dialogue also removes the following ones.
* [m] Get the parse icon to spin again.

## 1.3.1 (July 23, 2016)

* [m] Exclude .babelrc from NPM package
* [m] Bump dependencies

## 1.3.0 (June 2, 2016)

* [M] **Allow configuration of the message translation functions** (markers for message extraction).
* [M] **Support extraction of multi-line messages** (especially useful for complex MessageFormat strings with nested plurals and selections).
* Update docs.
* Deps: bump `graphql@0.6.0`, `react-relay@0.9.0` (+ related).
* Store sources always with slashes (not with backward-slashes in Windows).
* **Bugfix**: Details: correct variable usage (add namespace to selectedKeyId prop, to avoid overlap with Relay variable).
* Add thank-you note to readme.

## 1.2.1 (May 26, 2016)

* Fix SSR in production (bad relative paths).

## 1.2.0 (May 26, 2016)

* [M] Add server-side rendering (SSR)
* Show user notifications upon mutation errors.
* Use promises for all mutations.
* Add optimistic responses for delete and create mutations.
* **Bugfix**: fix Storyboard config.

## 1.1.0 (May 22, 2016)

* [M] Migrate to [Giu](https://github.com/guigrpa/giu) v0.4.x.
* [M] **Add hint screen**.
* Can now press alt-return to commit translation.
* Back end: compilation now happens synchronously rather than asynchronously whenever the DB changes, as part of the mutation.

## 1.0.4 (May 2, 2016)

* [M] **Use [Giu](https://github.com/guigrpa/giu) for all components**.
* **Fix #1**: Badly formatted translations crash the server process.

## 1.0.1, 1.0.2, 1.0.3 (Apr. 20, 2016)

* Fix production dependencies and config.
* [m] Remove columns for languages missing from config.

## 1.0.0 (Apr. 20, 2016)

* Semver
* [M] **Simpler translation edit** operations: click to edit, click outside to save, ESC to revert changes.
* [M] **Textareas instead of text inputs**, allowing multiline translation fields. Very, very customised textareas.
* [M] Basic message and language **statistics**.
* [M] **Autocompile**, whenever something changes -- never again forget the compilation step.
* [m] Don't highlight missing translations of *unused* keys.

## 0.1.6 (Apr. 18, 2016)

* [M] **Use mady on mady itself (i18n'd!)**.
* [m] Add spinner while parsing.
* [m] Lots of UX details.

## 0.1.5 (Apr. 16, 2016)

* First public release.
