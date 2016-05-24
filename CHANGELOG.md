# Changelog

* Show notifications upon mutation errors.
* Internal: Use promises for all mutations.
* Internal: Add optimistic responses for delete mutations.
* Internal: Fix Storyboard config.

## 1.1.0 (May 22, 2016)

* [M] Migrate to Giu v0.4.x.
* [M] **Add hint screen**.
* Can now press alt-return to commit translation.
* Back end: compilation now happens synchronously rather than asynchronously whenever the DB changes, as part of the mutation.

## 1.0.4 (May 2, 2016)

* [M] **Use `giu` for all components**.
* **Fix #1**: Badly formatted translations crash the server process.

## 1.0.1, 1.0.2, 1.0.3 (Apr. 20, 2016)

* Fix production dependencies and config.
* [m] Remove columns for languages missing from config.

## 1.0.0 (Apr. 20, 2016)

* Semver
* [M] **Simpler translation edit** operations: click to edit, click outside to save, ESC to revert changes.
* [M] **Textareas instead of text inputs**, allowing multiline translation fields. Very, very customised textareas.
* [M] Basic message and language **statistics**.
* [M] **Autocompile**, whenever something changes -- never again forget the compilation step.
* [m] Don't highlight missing translations of *unused* keys.

## 0.1.6 (Apr. 18, 2016)

* [M] **Use mady on mady itself (i18n'd!)**.
* [m] Add spinner while parsing.
* [m] Lots of UX details.

## 0.1.5 (Apr. 16, 2016)

* First public release.
