module.exports = {
  compilerOptions: {
    baseUrl: './',
    paths: {
      '@/*': ['src/*'],
    },
    target: 'ES6',
    allowJs: true,
  },
  exclude: ['node_modules'],
};