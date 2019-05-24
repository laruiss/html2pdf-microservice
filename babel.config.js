module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: {
          node: process.versions.node,
        },
      },
    ],
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
  ],
  sourceMaps: 'both',
}
