/* eslint-disable strict, indent, max-len, quote-props */

'use strict';

// ===============================================
// Basic config
// ===============================================
const NAME = 'mady';
const VERSION = '2.0.0';
const DESCRIPTION = 'Easy-to-use tool to manage and translate ICU MessageFormat messages';
const KEYWORDS = ['i18n', 'MessageFormat', 'translation', 'locales', 'translator'];

// ===============================================
// Helpers
// ===============================================
const runMultiple = (arr) => arr.join(' && ');
const runTestCov = (env, name) => {
  const envStr = env != null ? `${env} ` : '';
  return runMultiple([
    `cross-env ${envStr}jest --coverage`,
    `mv .nyc_output/coverage-final.json .nyc_tmp/coverage-${name}.json`,
  ]);
};

const WEBPACK_OPTIONS = '--config ./src/server/webpackConfig.cjs ' +
  '--progress ' +
  // '--display-modules ' +
  '--display-chunks';
const runWebpack = ({ fProduction, fSsr, fWatch } = {}) => {
  const out = [`rm -rf ./public/${fSsr ? 'ssr' : 'assets'}`];
  if (fSsr) out.push('rm -rf ./lib/server/ssr');
  const env = [];
  if (fSsr) env.push('SERVER_SIDE_RENDERING=true');
  if (fProduction) env.push('NODE_ENV=production');
  const envStr = env.length ? `cross-env ${env.join(' ')} ` : '';
  const webpackOpts = `${WEBPACK_OPTIONS}${fWatch ? ' --watch' : ''}`;
  out.push(`${envStr}webpack ${webpackOpts}`);
  return runMultiple(out);
};

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
    start:                      'babel-node src/server/startup --dir src/locales',
    startAlt:                   'babel-node src/server/startup --dir tools/locales',
    startProd:                  'node lib/mady --dir src/locales',
    compile:                    runMultiple([
                                  'rm -rf ./lib',
                                  'mkdir lib',
                                  'babel --out-dir lib --ignore "**/__mocks__/**","**/__tests__/**" src',
                                  'cp src/translate.js.flow lib/'
                                ]),
    updateSchemaJson:           'babel-node src/server/gqlUpdateSchema',
    docs:                       'extract-docs --template docs/templates/README.md --output README.md',
    buildSsrWatch:              runWebpack({ fSsr: true, fWatch: true }),
    buildSsr:                   runWebpack({ fSsr: true, fProduction: true }),
    buildClient:                runWebpack({ fProduction: true }),
    build:                      runMultiple([
                                  'node package',
                                  'npm run lint',
                                  'npm run flow',
                                  'npm run compile',
                                  'npm run buildClient',
                                  'npm run buildSsr',
                                  'npm run test',
                                  'npm run docs',
                                  'npm run xxl',
                                ]),
    travis:                     runMultiple([
                                  'npm run compile',
                                  'npm run testCovFullExceptMin',
                                ]),

    // Static analysis
    lint:                       'eslint src',
    flow:                       'flow check || exit 0',
    xxl:                        "xxl --src \"[\\\"src\\\"]\"",  // eslint-disable-line quotes

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
    jest:                       'jest --watch --coverage',
    jestDebug:                  'node --debug-brk --inspect node_modules/.bin/jest -i',
    testCovPrepare:             runMultiple([
                                  'rm -rf ./coverage .nyc_output .nyc_tmp',
                                  'mkdir .nyc_tmp',
                                ]),
    testDev:                    runTestCov('NODE_ENV=development', 'dev'),
    testProd:                   runTestCov('NODE_ENV=production', 'prod'),
    testMin:                    runTestCov('TEST_MINIFIED_LIB=1', 'min'),
    testCovReport:              runMultiple([
                                  'cp .nyc_tmp/* .nyc_output/',
                                  'nyc report --reporter=html --reporter=lcov --reporter=text',
                                ]),
  },


  // -----------------------------------------------
  // Deps
  // -----------------------------------------------
  dependencies: {
    timm: '1.1.1',
    storyboard: '2.1.2',
    lodash: '4.16.0',
    commander: '2.9.0',
    'node-uuid': '1.4.7',
    bluebird: '3.4.6',
    'fs-extra': '0.30.0',
    'diveSync': '0.3.0',
    'messageformat': '1.0.2',
    'uglify-js': '2.7.3',
    'slash': '1.0.0',
    opn: '4.0.2',

    // Express + plugins
    express: '4.14.0',
    ejs: '2.5.2',
    'cookie-parser': '1.4.3',
    compression: '1.6.2',

    // GraphQL
    graphql: '0.7.0',
    'graphql-relay': '0.4.3',
    'express-graphql': '0.5.4',
    'babel-relay-plugin': '0.9.3',
  },

  peerDependencies: {
    'babel-core': '^6.0.0',
    'babel-preset-es2015': '^6.0.0',
    'babel-preset-stage-0': '^6.0.0',
    'babel-preset-react': '^6.0.0',
    'babel-plugin-react-intl': '^2.2.0',
  },

  devDependencies: {

    // Packaged in the client app (or SSR)
    // --------------------------
    'babel-polyfill': '6.16.0',
    giu: '0.8.1',

    // Bug yarn #629
    chokidar: '1.6.1',

    // React
    react:                            '15.3.2',
    'react-dom':                      '15.3.2',
    'react-addons-perf':              '15.3.2',
    'react-addons-pure-render-mixin': '15.3.2',  // remove when giu is upgraded!
    'react-relay': '0.9.3',
    'isomorphic-relay': '0.7.3',
    'react-intl': '2.1.5',

    // Miscellaneous
    'font-awesome': '4.6.3',
    moment: '2.14.0',
    tinycolor2: '1.4.1',
    'tiny-cookie': '0.5.5',

    // Pure dev dependencies
    // ---------------------
    // Babel + plugins (except babel-eslint)
    'babel-cli': '6.16.0',
    'babel-core': '6.17.0',
    'babel-plugin-react-intl': '2.2.0',
    'babel-preset-es2015': '6.16.0',
    'babel-preset-stage-0': '6.16.0',
    'babel-preset-react': '6.16.0',
    // 'babel-preset-react-hmre': '1.1.1', // to use Hot Module Replacement

    // Webpack + loaders (+ related stuff)
    webpack: '1.13.2',
    'webpack-dev-middleware': '1.8.4',
    'webpack-hot-middleware': '2.13.0',
    'babel-loader': '6.2.5',
    'file-loader': '0.9.0',
    'css-loader': '0.25.0',
    'style-loader': '0.13.1',
    'json-loader': '0.5.4',
    'bundle-loader': '0.5.4',
    'sass-loader': '4.0.2',
    'node-sass': '3.10.1',
    'extract-text-webpack-plugin': '1.0.1',

    // Linting
    eslint: '3.8.1',
    'eslint-config-airbnb': '12.0.0',
    'eslint-plugin-flowtype': '2.20.0',
    'eslint-plugin-import': '1.16.0',
    'eslint-plugin-jsx-a11y': '2.2.3',
    'eslint-plugin-react': '6.4.1',
    'babel-eslint': '7.0.0',

    // Testing
    jest: '16.0.1',
    'react-test-renderer': '15.3.2',
    'babel-jest': '16.0.0',
    nyc: '8.3.0',
    coveralls: '2.11.14',

    // Other tools
    'extract-docs': '1.3.0',
    'xxl': '0.1.1',
    'cross-env': '2.0.1',
    'flow-bin': '0.33.0',
  },

  // -----------------------------------------------
  // Other configs
  // -----------------------------------------------
  jest: {
    // Default test path:
    // testRegex: '(/__tests__/.*|\\.(test|spec))\\.(js|jsx)$',
    testRegex: 'src/.*__tests__/.*\\.(test|spec)\\.(js|jsx)$',
    moduleNameMapper: {
      '^.+\\.(css|less|sass)$': '<rootDir>/test/emptyObject.js',
      '^.+\\.(gif|ttf|eot|svg)$': '<rootDir>/test/emptyString.js',
      // 'node-uuid': '<rootDir>/test/mockUuid.js',
    },
    coverageDirectory: '.nyc_output',
    coverageReporters: ['json', 'text', 'html'],
    collectCoverageFrom: [
      'src/**/*.js',
      '!**/node_modules/**',
      '!**/__tests__/**',
      '!**/__mocks__/**',
      '!src/locales/**',
      '!src/localesBackup/**',
      '!src/exampleLocales.js',
      '!src/mady.js',
      '!src/server/importData.js',
      '!src/client/components/999-reactIntlExample.js',
    ],
    setupTestFrameworkScriptFile: './test/setup.js',
  },
};

// ===============================================
// Build package.json
// ===============================================
const _sortDeps = (deps) => {
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

/* eslint-enable strict, indent, max-len, quote-props */
