'use strict';

// ===============================================
// Basic config
// ===============================================
const NAME = 'mady';
const VERSION = '1.1.0';
const DESCRIPTION = 'Easy-to-use tool to manage and translate ICU MessageFormat messages';
const KEYWORDS = ['i18n', 'MessageFormat', 'translation', 'locales', 'translator'];

// ===============================================
// Helpers
// ===============================================
const WEBPACK_OPTIONS = '--config ./src/server/webpackConfigCommonJS ' +
  '--progress ' +
  // '--display-modules ' +
  '--display-chunks';

const runMultiple = arr => arr.join(' && ');
const runTestCov = env => {
  const envStr = env != null ? `${env} ` : '';
  return runMultiple([
    `cross-env ${envStr}nyc ava`,
    'mv .nyc_output/* .nyc_tmp/',
  ]);
};
const runWebpackSsr = fWatch => runMultiple([
  'rm -rf ./lib/server/ssr',
  `cross-env SERVER_SIDE_RENDERING=true webpack ${WEBPACK_OPTIONS}${fWatch ? ' --watch' : ''}`,
]);
const WEBPACK_CLIENT = `cross-env NODE_ENV=production webpack ${WEBPACK_OPTIONS}`;

// ===============================================
// Specs
// ===============================================
const specs = {

  // -----------------------------------------------
  // General
  // -----------------------------------------------
  name: NAME,
  version: VERSION,
  description: DESCRIPTION,
  bin: {
    mady: 'lib/mady.js',
  },
  main: 'lib/translate.js',
  engines: {
    node: '>=4',
  },
  author: 'Guillermo Grau Panea',
  license: 'MIT',
  keywords: KEYWORDS,
  homepage: `https://github.com/guigrpa/${NAME}#readme`,
  bugs: {
    url: `https://github.com/guigrpa/${NAME}/issues`,
  },
  repository: {
    type: 'git',
    url: `git+https://github.com/guigrpa/${NAME}.git`,
  },

  // -----------------------------------------------
  // Scripts
  // -----------------------------------------------
  scripts: {

    // Top-level
    start:                      'babel-node src/server/startup',
    startProd:                  'node lib/mady',
    compile:                    runMultiple([
                                  'rm -rf ./lib',
                                  'mkdir lib',
                                  'babel -d lib src',
                                  // 'babel --no-babelrc --presets react --plugins transform-flow-strip-types -d libEs6 src',
                                  // 'cp -r src libEs6_flow',
                                ]),
    updateSchemaJson:           'babel-node src/server/gqlUpdateSchema',
    docs:                       'extract-docs --template docs/templates/README.md --output README.md',
    buildSsrWatch:              runWebpackSsr(true),
    buildSsr:                   runWebpackSsr(false),
    buildClient:                WEBPACK_CLIENT,
    build:                      runMultiple([
                                  'node package',
                                  //'npm run lint',
                                  //'npm run flow',
                                  'npm run compile',
                                  'npm run buildClient',
                                  'npm run test',
                                  'npm run docs',
                                ]),
    travis:                     runMultiple([
                                  'npm run compile',
                                  'npm run testCovFullExceptMin',
                                ]),

    // Static analysis
    lint:                       'eslint src',
    flow:                       'flow && test $? -eq 0 -o $? -eq 2',
    flowStop:                   'flow stop',

    // Testing - general
    test:                       'npm run testCovFull',
    testCovFull:                runMultiple([
                                  'npm run testCovPrepare',
                                  'npm run testDev',
                                  'npm run testProd',
                                  // 'npm run testMin',
                                  'npm run testCovReport',
                                ]),
    testCovFullExceptMin:       runMultiple([
                                  'npm run testCovPrepare',
                                  'npm run testDev',
                                  'npm run testProd',
                                  'npm run testCovReport',
                                ]),
    testCovFast:                runMultiple([
                                  'npm run testCovPrepare',
                                  'npm run testDev',
                                  'npm run testCovReport',
                                ]),

    // Testing - steps
    ava:                        'ava --watch',
    testCovPrepare:             runMultiple([
                                  'rm -rf ./coverage .nyc_output .nyc_tmp',
                                  'mkdir .nyc_tmp',
                                ]),
    testDev:                    runTestCov('NODE_ENV=development'),
    testProd:                   runTestCov('NODE_ENV=production'),
    testMin:                    runTestCov('TEST_MINIFIED_LIB=1'),
    testCovReport:              runMultiple([
                                  'cp .nyc_tmp/* .nyc_output/',
                                  'nyc report --reporter=html --reporter=lcov --reporter=text',
                                ]),
  },


  // -----------------------------------------------
  // Deps
  // -----------------------------------------------
  dependencies: {
    timm: '^0.6.0',
    storyboard: '^1.0.0',
    lodash: '^4.8.2',
    inquirer: '^1.0.0',
    commander: '^2.9.0',
    "node-uuid": "1.4.7",
    bluebird: '^3.3.4',
    'fs-extra': '^0.28.0',
    'diveSync': '0.3.0',
    'messageformat': '0.3.0',
    'uglify-js': '2.6.2',

    // Express + plugins
    express: '4.13.4',
    ejs: '2.4.1',
    'cookie-parser': '1.4.1',
    compression: '1.6.1',

    // GraphQL
    graphql:              '0.5.0',
    'graphql-relay':      '0.4.1',
    'express-graphql':    '0.5.1',
    'babel-relay-plugin': '0.8.0',
  },

  devDependencies: {

    // Packaged in the client app
    // --------------------------
    'babel-polyfill': '6.7.4',
    giu: '^0.4.0',

    // React
    react:                            '15.0.2',
    'react-dom':                      '15.0.2',
    'react-addons-pure-render-mixin': '15.0.2',
    'react-addons-perf':              '15.0.2',
    'react-relay':        '0.8.0',

    // Miscellaneous
    'font-awesome': '4.6.1',
    moment: '^2.11.2',
    tinycolor2: '1.3.0',
    'tiny-cookie': '0.5.5',

    // Pure dev dependencies
    // ---------------------
    // Babel + plugins (except babel-eslint)
    'babel-cli': '^6.6.5',
    'babel-core': '^6.7.2',
    'babel-plugin-transform-flow-strip-types': '^6.7.0',
    'babel-preset-es2015': '^6.6.0',
    'babel-preset-stage-0': '^6.5.0',
    'babel-preset-react': '^6.5.0',
    'babel-preset-react-hmre': '1.1.1', // to use Hot Module Replacement

    // Webpack + loaders (+ related stuff)
    webpack: '1.13.0',
    'webpack-dev-middleware': '1.6.1',
    'webpack-hot-middleware': '2.10.0',
    'babel-loader': '6.2.4',
    'file-loader': '0.8.5',
    'css-loader': '0.23.1',
    'style-loader': '0.13.1',
    'json-loader': '0.5.4',
    'bundle-loader': '0.5.4',
    'sass-loader': '3.2.0',
    'node-sass': '3.7.0',
    'extract-text-webpack-plugin': '1.0.1',

    // Linting
    eslint: '^2.4.0',
    'eslint-config-airbnb': '^9.0.0',
    'eslint-plugin-flowtype': '^2.2.2',
    'eslint-plugin-react': '^5.1.1',
    'eslint-plugin-jsx-a11y': '^1.2.2',
    'eslint-plugin-import': '^1.8.0',
    'babel-eslint': '^6.0.0',

    // Testing
    ava: '^0.14.0',
    nyc: '^6.1.1',
    coveralls: '^2.11.6',

    // Other tools
    'extract-docs': '^1.0.0',
    'cross-env': '^1.0.7',
    'flow-bin': '^0.23.0',
  },

  // -----------------------------------------------
  // Other configs
  // -----------------------------------------------
  ava: {
    files: [
      './test/test.js',
    ],
    babel: 'inherit',
  },
};

// ===============================================
// Build package.json
// ===============================================
const _sortDeps = deps => {
  const newDeps = {};
  for (const key of Object.keys(deps).sort()) {
    newDeps[key] = deps[key];
  }
  return newDeps;
};
specs.dependencies = _sortDeps(specs.dependencies);
specs.devDependencies = _sortDeps(specs.devDependencies);
const packageJson = `${JSON.stringify(specs, null, '  ')}\n`;
require('fs').writeFileSync('package.json', packageJson);
