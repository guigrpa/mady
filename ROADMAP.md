Urgent:

* [x] Add `isMarkdown` and `scope` to message types
* [x] During source parsing, use `getExtraMessages()` in `/locales`
* [x] Translations are saved normally, in `${lang}.json`
* [ ] During compilation:
    * [ ] Don't consider `isMarkdown`-flagged messages as MessageFormat
    * [ ] Don't include `scope`d keys in the output .js files
* [ ] **Define better**: Implement `getTranslationsForScope(xxx)` to obtain only the translations of interest. buildDataPackages() can merge those with the ones obtained from `require(`.locales`)`
* [ ] Improve editing of long data. Include markdown preview
* [ ] [Future] Allow integration with another server:
    * Serve assets
    * Events to report on changes: added translations, new messages, etc. Events could be used to trigger prepareBuild, build, same as manually editing variable contents.

Later:

* Allow setting `originalLang` from the GUI
* Chores: Bump to React 16 (check correct scrollbar width upon first re-render at the client side)
* Chores: Bump other deps
* Improvement: Show error when user specifies a language that doesn't exist
* Improvement: Use Giu's DataTable
* Bugfix: Fix Jest running: it never stops when testing locally (it does in Travis)

Someday: *Nothing identified right now!*
