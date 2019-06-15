module.exports = {
  outputDir: 'dist',
  filenameHashing: false,
  productionSourceMap: false,
  css: {
    extract: {
      filename: '[name].css'
    }
  },
  pages: {},
  chainWebpack: config => {
    const svgRule = config.module.rule('svg');
    svgRule.uses.clear();

    config.optimization.splitChunks(false);

    svgRule.use('vue-svg-loader').loader('vue-svg-loader');
  },
  configureWebpack: () => {
    if (process.env.VUE_APP_BUILD_TARGET === 'js-components') {
      return {
        output: {
          filename: '[name].js',
          library: 'LIB',
          libraryTarget: 'var'
        },
        entry: './src'
      };
    }
  }
};
