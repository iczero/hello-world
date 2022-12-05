const TerserPlugin = require('terser-webpack-plugin');

let config = module.exports = require('./webpack.common.js')('output.html', true);
config.mode = 'production';
config.optimization = {
  minimize: true,
  minimizer: [new TerserPlugin({
    test: /.*/,
    parallel: true,
    extractComments: {
      banner: false
    }
  })]
};
