* Add subscriptions
    - [x] PoC server side
    - [ ] PoC client side
        - [x] Basic
        - [ ] Add key creation subscription, ideally sharing the same payloads as keyUpdated
        - [ ] Add translation subscriptions
        - [ ] Unsubscribe
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