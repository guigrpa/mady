import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import sass from 'rollup-plugin-sass';

export default {
  entry: 'src/client/startup.js',
  dest: 'tools/bundle.js',
  format: 'cjs',
  plugins: [
    json(),
    babel(),
    sass({
      output: 'hellothere.css',
      options: {
        indentedSyntax: true,
      },
    }),
  ],
};
