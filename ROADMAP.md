* Add subscriptions
    - [ ] If we keep creation subscriptions, check what happens if there are many createdKeys at the same time. It may be painfully slow. Consider a parsed subscription instead.

    - [ ] Rethink component API, considering fragments...
    - [ ] Server db: publish key changes in more cases, not only creation
    - [ ] Refactor server:
        - [ ] Move to graphql subfolder
        - [ ] Separate addMutation, addSubscription, other relay helpers
    - [ ] Check that SSR doesn't break
    - [ ] Fix Flow
    - Improve creation subscriptions, so that they no longer require full data downloads

* Cut release
* Bump React to 16
* Show error when user specifies a language that doesn't exist
* Use Giu's DataTable
* Add watch-based parsing
* Add Google Translate (triggers for all new keys and languages, sent to users asynchronously)


Someday: *Nothing identified right now!*