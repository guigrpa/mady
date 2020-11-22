- Modules:

  - [x] mady - translate function
  - [x] mady-server
  - [ ] mady-server as embeddable
  - [ ] test mady-server:
    - scoped messages: why are those with braces not included in the scoped output?
    - why does editorial getExtraMessages() not output seq?
  - [ ] mady-ui
    - Use giu as peer
    - Main app: can receive "filter" props; then it will always show a filtered list...
    - Improve editing of long data. Include markdown preview?
    - Allow setting `originalLang` from the GUI
    - Use Giu's DataTable
    - Improvement: Show error when user specifies a language that doesn't exist
  - [ ] serve mady-ui under mady-server /mady

Later still:

- Chores: Bump to React 16 (check correct scrollbar width upon first re-render at the client side)
- Chores: Bump other deps
