Urgent:

* [ ] Why aren't messages from getExtraMessages() updated, when data.json changes?
* [ ] Client:
    * [x] For isMarkdown keys, don't enforce MessageFormat validation in translations
    * [ ] Improve editing of long data. Include markdown preview

Later:

* Allow integration with another server:
    * Serve assets
    * Events to report on changes: added translations, new messages, etc. Events could be used to trigger prepareBuild, build, same as manually editing variable contents.

Later still:

* Allow setting `originalLang` from the GUI
* Chores: Bump to React 16 (check correct scrollbar width upon first re-render at the client side)
* Chores: Bump other deps
* Improvement: Show error when user specifies a language that doesn't exist
* Improvement: Use Giu's DataTable
* Bugfix: Fix Jest running: it never stops when testing locally (it does in Travis)

Someday: *Nothing identified right now!*
