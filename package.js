/* eslint-disable strict, indent, max-len, quote-props */

'use strict';

// ===============================================
// Basic config
// ===============================================
const NAME = 'mady';
const VERSION = '2.2.0';
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
const runWebpack = ({ fProduction, fSsr, fWatch, fAnalyze } = {}) => {
  const out = [`rm -rf ./public/${fSsr ? 'ssr' : 'assets'}`];
  if (fSsr) out.push('rm -rf ./lib/server/ssr');
  const env = [];
  if (fSsr) env.push('SERVER_SIDE_RENDERING=true');
  if (fProduction) env.push('NODE_ENV=production');
  if (fAnalyze) env.push('ANALYZE_BUNDLE=true');
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
                                  'yarn compile:schema',
                                  'yarn compile:relay',
                                  'babel --out-dir lib --ignore "**/__mocks__/**","**/__tests__/**" src',
                                  'cp src/api.js.flow lib/translate.js.flow',
                                ]),
    'compile:relay':            'relay-compiler --src ./src --schema ./src/common/gqlSchema.graphql',
    'compile:relayWatch':       'relay-compiler --src ./src --schema ./src/common/gqlSchema.graphql --watch',
    'compile:schema':           'babel-node src/server/gqlUpdateSchema',
    docs:                       'extract-docs --template docs/templates/README.md --output README.md',
    buildSsrWatch:              runWebpack({ fSsr: true, fWatch: true }),
    buildSsr:                   runWebpack({ fSsr: true, fProduction: true }),
    buildClient:                runWebpack({ fProduction: true }),
    buildClientWatch:           runWebpack({ fWatch: true }),
    buildAnalysis:              runWebpack({ fAnalyze: true }),
    buildAnalysisProd:          runWebpack({ fAnalyze: true, fProduction: true }),
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
    xxl:                        'xxl',

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
    'jest-html':                'jest-html --snapshot-patterns "src/**/*.snap"',
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
    timm: '1.2.5',
    storyboard: '^3.0.0',
    'storyboard-listener-console': '^3.0.0',
    'storyboard-listener-ws-server': '^3.0.0',
    lodash: '4.17.4',
    commander: '2.9.0',
    'uuid': '3.0.1',
    bluebird: '3.4.6',
    'fs-extra': '0.30.0',
    'diveSync': '0.3.0',
    'messageformat': '1.0.2',
    'uglify-js': '2.7.3',
    'slash': '1.0.0',
    opn: '4.0.2',

    // Express + plugins
    express: '4.15.2',
    ejs: '2.5.6',
    'cookie-parser': '1.4.3',
    compression: '1.6.2',

    // GraphQL
    graphql: '0.9.3',
    'graphql-relay': '0.5.1',
    'express-graphql': '0.6.4',
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
    'babel-polyfill': '6.23.0',
    giu: '0.10.2',

    'storyboard-listener-browser-extension': '^3.0.0',
    'storyboard-listener-ws-client': '^3.0.0',

    // React
    react:                            '15.5.4',
    'react-dom':                      '15.5.4',
    'react-relay': '1.0.0-rc.2',
    'relay-compiler': '1.0.0-rc.2',
    'relay-runtime': '1.0.0-rc.2',
    'babel-plugin-relay': '1.0.1-rc.2',
    'react-intl': '2.2.3',

    // Miscellaneous
    'font-awesome': '4.6.3',
    moment: '2.18.1',
    tinycolor2: '1.4.1',
    'tiny-cookie': '0.5.5',

    // Pure dev dependencies
    // ---------------------
    // Babel + plugins (except babel-eslint)
    'babel-cli': '6.24.1',
    'babel-core': '6.24.1',
    'babel-plugin-react-intl': '2.3.1',
    'babel-plugin-syntax-dynamic-import': '6.18.0',
    'babel-preset-es2015': '6.24.1',
    'babel-preset-stage-0': '6.24.1',
    'babel-preset-react': '6.24.1',

    // Webpack + loaders (+ related stuff)
    webpack: '2.4.1',
    'webpack-bundle-analyzer': '2.4.0',
    'babel-loader': '7.0.0',
    'file-loader': '0.11.1',
    'css-loader': '0.28.0',
    'style-loader': '0.16.1',
    'sass-loader': '6.0.3',
    'node-sass': '4.5.2',
    'extract-text-webpack-plugin': '2.0.0-rc.2',

    // Linting
    eslint: '3.19.0',
    'eslint-config-airbnb': '12.0.0',
    'eslint-plugin-flowtype': '2.32.1',
    'eslint-plugin-import': '1.16.0',
    'eslint-plugin-jsx-a11y': '2.2.3',
    'eslint-plugin-react': '6.10.3',
    'babel-eslint': '7.2.3',

    // Testing
    jest: '19.0.2',
    'babel-jest': '19.0.0',
    'jest-html': '^1.3.2',
    'react-test-renderer': '15.5.4',
    nyc: '8.3.0',
    coveralls: '2.13.0',

    // Other tools
    'extract-docs': '1.4.0',
    'xxl': '^1.2.0',
    'cross-env': '2.0.1',
    'flow-bin': '0.44.2',
  },

  // -----------------------------------------------
  // Other configs
  // -----------------------------------------------
  jest: {
    // Default test path:
    // testRegex: '(/__tests__/.*|\\.(test|spec))\\.(js|jsx)$',
    testRegex: 'src/.*__tests__/.*\\.(test|spec)\\.(js|jsx)$',
    moduleNameMapper: {
      '^typeface-.*': '<rootDir>/test/emptyObject.js',
      '\\.(css|less|sass)$': '<rootDir>/test/emptyObject.js',
      '\\.(gif|ttf|eot|svg)$': '<rootDir>/test/emptyString.js',
      // 'node-uuid': '<rootDir>/test/mockUuid.js',
    },
    coverageDirectory: '.nyc_output',
    coverageReporters: ['json', 'text', 'html'],
    snapshotSerializers: ['<rootDir>/node_modules/jest-html'],
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
      '!src/client/components/fetchLangBundle.js',
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
