const presets = [
  [
    '@babel/env',
    {
      targets: {
        browsers: '> 1.5%, not dead',
      },
    },
  ],
  '@babel/preset-react',
  '@babel/typescript',
];

const plugins = ['@babel/plugin-proposal-class-properties'];

module.exports = { presets, plugins };
