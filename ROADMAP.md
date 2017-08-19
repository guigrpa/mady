* Cut release
- [ ] Refactor server:
    - [ ] Move to graphql subfolder
    - [ ] Separate addMutation, addSubscription, other relay helpers
* Reduce number of pushed events when src files are parsed
* Bump other deps
* Fix Jest running: it never stops when testing locally (it does in Travis)
* Show error when user specifies a language that doesn't exist
* Use Giu's DataTable
* Add watch-based parsing
* Add Google Translate (triggers for all new keys and languages, sent to users asynchronously)
- Improve creation subscriptions, so that they no longer require full data downloads
* Bump to React 16 (check correct scrollbar width upon first re-render at the client side)

Someday: *Nothing identified right now!*