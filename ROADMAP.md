* Add subscriptions
    - [ ] createdTranslation subscription
    - [ ] Refactor subscriptions, esp. createdKey: try not to repeat fragments in the subscription!
    - [ ] Rethink component API, considering fragments...
    - [ ] Server db: publish key changes in more cases, not only creation
    - [ ] Unsubscribe (needed?)
    - [ ] Clean up client fragments
    - [ ] Refactor server:
        - [ ] Move to graphql subfolder
        - [ ] Separate addMutation, addSubscription, other relay helpers
    - [ ] Check that SSR doesn't break
* Bump React to 16
* Show error when user specifies a language that doesn't exist
* Use Giu's DataTable
* Split in two, adding oao and creating mady-cli
* Add watch-based parsing
* Add Google Translate (triggers for all new keys and languages, sent to users asynchronously)

Someday: *Nothing identified right now!*