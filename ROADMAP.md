* Complete migration to Relay Modern:
    - Remove deleteKey in DB
    * Refactor schema: remove unnecessary arguments in mutations
    - Change mutation API (remove set, unset)
    - SSR
    - Subscriptions?
    - Investigate Apollo client
    - Fix parseSrcFiles
* Update server, using async/await
* Update Flow types: naming
* Fix delete translation when text is selected
* Bump deps (incl. Giu, React)
* Remove package.js
* Fix webpack config (reference: giu-examples)
* Fix SSR

Someday:

* Auto-translation via Google Translate (as hint)
* Test message inheritance among languages?
* Fix reference time for Jest snapshots?
