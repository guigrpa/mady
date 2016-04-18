- [x] _t implementation
- [x] Compile translations: even when there is no translation, compile a default function for those keys with braces
- [x] Delete key
- [-] Optimistic mutations
- [-] SSR
- [x] Save langs in cookies, not in localStorage (use in SSR)
- [x] Show spinner while doing lengthy things: parsing files, etc.
- [x] Remove moment.js locales (except for the supported languages)
- [x] Use _t in Mady itself
- [x] Include possibility to change language in Mady config (use it to bootstrap the correct locales). Add bundle-loader for locale fetching
- [ ] Add --build option to CLI
- [ ] Use draft.js for text inputs? Improve the way long translations are shown
- [ ] Details in various areas:
    + Key: # total, # unused, + details for selected key
    + Per language: # missing translations
- [x] Key shortcuts, blur/focus shortcuts
- [ ] ESC key reverts changes
