# mady

## Functionalities

* Configuration
* CRUD languages
* Locales input:
    - Parsing
    - Old i18n tool
    - Manual
* Library operations:
    - Purging
* Output:
    - Uglified JS

* Team-oriented!
* Ease of use: 
    - Just run `mady`
    - First time round, it asks you for a path and port (unless specified in the command line)

## Implementation

* Web-based for flexibility, ease-of-use
* React, Redux, fetch
* GraphQL, but not Relay
* Storage: file based, not DB (aims at OSS projects, simple setup!)

## Data model

* `config.json` file:
    - `srcPaths` array
    - `srcExtensions` array
    - `languages` array
* `locales.json` file:
    - key: e.g. `validationError_must be one of the following: {LIST}`
    - attributes:
        + `firstUsed`
        + `unusedSince`
        + `sources`
* Language (e.g. `es_ES.json`) files: does not necessarily contain all keys:
    - key: same as in `locales.json`
    - attributes:
        + `translation`
