const path = require('path');
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '../panel' : '/',
  outputDir: path.resolve(__dirname, './../extensions/panel'),
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import '@/scss/variables.scss';`,
      },
      sass: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.sass` 这个文件
        // 注意：在 sass-loader v8 中，这个选项名是 "prependData"
        additionalData: `@import '@/scss/variables.scss';`,
      },
    },
  },
};
