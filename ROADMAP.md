- Modules:

  - [x] mady - translate function
  - [ ] mady-server
    - [ ] GET keys, translations: process query.scope when !== undefined
    - [ ] Add GET keysAndTranslations with multiple langs and query.scope
  - [x] mady-server as embeddable
  - [ ] test mady-server:
    - why does editorial getExtraMessages() not output seq?
  - [ ] mady-editor
    - No Config from GUI
    - Use giu as peer (?) -- but then we
    - Main app: can receive "filter" props; then it will always show a filtered list...
    - Improve editing of long data. Include markdown preview?
    - Use Giu's DataTable
    - Improvement: Show error when user specifies a language that doesn't exist
    - [ ] serve mady-ui under mady-server /mady

Later still:

- Chores: Bump to React 16 (check correct scrollbar width upon first re-render at the client side)
- Chores: Bump other deps
