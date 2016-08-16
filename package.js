/* eslint-disable strict, indent, max-len, quote-props */
'use strict';

// ===============================================
// Basic config
// ===============================================
const NAME = 'mady';
const VERSION = '1.5.0';
const DESCRIPTION = 'Easy-to-use tool to manage and translate ICU MessageFormat messages';
const KEYWORDS = ['i18n', 'MessageFormat', 'translation', 'locales', 'translator'];

// ===============================================
// Helpers
// ===============================================
const runMultiple = arr => arr.join(' && ');
const runTestCov = env => {
  const envStr = env != null ? `${env} ` : '';
  return runMultiple([
    `cross-env ${envStr}nyc ava`,
    'mv .nyc_output/* .nyc_tmp/',
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
    buildSsrWatch:              runWebpack({ fSsr: true, fWatch: true }),
    buildSsr:                   runWebpack({ fSsr: true, fProduction: true }),
    buildClient:                runWebpack({ fProduction: true }),
    build:                      runMultiple([
                                  'node package',
                                  // 'npm run lint',
                                  // 'npm run flow',
                                  'npm run compile',
                                  'npm run buildClient',
                                  'npm run buildSsr',
                                  // 'npm run test',
                                  'npm run docs',
                                  'npm run xxl',
                                ]),
    travis:                     runMultiple([
                                  'npm run compile',
                                  'npm run testCovFullExceptMin',
                                ]),

    // Static analysis
    lint:                       'eslint src',
    flow:                       'flow && test $? -eq 0 -o $? -eq 2',
    flowStop:                   'flow stop',
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
    timm: '1.0.0',
    storyboard: '2.0.2',
    lodash: '4.14.1',
    inquirer: '1.1.2',
    commander: '2.9.0',
    'node-uuid': '1.4.7',
    bluebird: '3.4.1',
    'fs-extra': '0.30.0',
    'diveSync': '0.3.0',
    'messageformat': '0.3.0',
    'uglify-js': '2.6.2',
    'slash': '1.0.0',

    // Express + plugins
    express: '4.14.0',
    ejs: '2.4.2',
    'cookie-parser': '1.4.3',
    compression: '1.6.2',

    // GraphQL
    graphql: '0.6.1',
    'graphql-relay': '0.4.2',
    'express-graphql': '0.5.3',
    'babel-relay-plugin': '0.9.2',
  },

  devDependencies: {

    // Packaged in the client app (or SSR)
    // --------------------------
    'babel-polyfill': '6.7.4',
    giu: '0.7.1',

    // React
    react:                            '15.2.1',
    'react-dom':                      '15.2.1',
    'react-addons-pure-render-mixin': '15.2.1',
    'react-addons-perf':              '15.2.1',
    'react-relay': '0.9.2',
    'isomorphic-relay': '0.7.0',

    // Miscellaneous
    'font-awesome': '4.6.3',
    moment: '2.13.0',
    tinycolor2: '1.3.0',
    'tiny-cookie': '0.5.5',

    // Pure dev dependencies
    // ---------------------
    // Babel + plugins (except babel-eslint)
    'babel-cli': '6.8.0',
    'babel-core': '6.8.0',
    'babel-plugin-transform-flow-strip-types': '6.8.0',
    'babel-preset-es2015': '6.6.0',
    'babel-preset-stage-0': '6.5.0',
    'babel-preset-react': '6.5.0',
    'babel-preset-react-hmre': '1.1.1', // to use Hot Module Replacement

    // Webpack + loaders (+ related stuff)
    webpack: '1.13.1',
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
    eslint: '2.9.0',
    'eslint-config-airbnb': '9.0.1',
    'eslint-plugin-flowtype': '2.3.1',
    'eslint-plugin-react': '5.2.2',
    'eslint-plugin-jsx-a11y': '1.2.2',
    'eslint-plugin-import': '1.8.0',
    'babel-eslint': '6.0.4',

    // Testing
    ava: '0.15.0',
    nyc: '6.4.4',
    coveralls: '2.11.11',

    // Other tools
    'extract-docs': '1.0.1',
    'xxl': '0.1.1',
    'cross-env': '1.0.7',
    'flow-bin': '0.23.1',
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

/* eslint-enable strict, indent, max-len, quote-props */
