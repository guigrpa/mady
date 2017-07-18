* Complete migration to Relay Modern:
    - Remove deleteKey in DB
    * Refactor schema: remove unnecessary arguments in mutations
    * Fix tests
    - Change mutation API (remove set, unset)
    - SSR
    - Subscriptions?
    - Investigate Apollo client
    * Merge changes in master!
* Update server, using async/await
* Update Flow types: naming
* Bump deps (incl. Giu, React)
* Remove package.js
* Fix webpack config (reference: giu-examples)
* Fix SSR

Someday:

* Auto-translation via Google Translate (as hint)
* Test message inheritance among languages?
* Fix reference time for Jest snapshots?
