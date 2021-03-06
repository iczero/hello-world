const { Compilation, ProvidePlugin } = require('webpack');
const { ConcatSource } = require('webpack-sources');
const TerserPlugin = require('terser-webpack-plugin');

const OUTPUT_FILENAME = 'output.html';

module.exports = {
  entry: './src/index.tsx',
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      test: /.*/,
      parallel: true,
      extractComments: {
        banner: false
      }
    })]
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  output: {
    filename: OUTPUT_FILENAME
  },
  plugins: [
    new ProvidePlugin({
      process: 'process/browser'
    }),
    {
      // wrap output in script tags
      // pile of hacks
      apply(compiler) {
        compiler.hooks.compilation.tap('ScriptWrapPlugin', compilation => {
          compilation.hooks.processAssets.tap(
            {
              name: 'ScriptWrapPlugin',
              stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE
            },
            () => {
              const source = new ConcatSource();
              source.add('<script>');
              source.add(compilation.assets[OUTPUT_FILENAME]);
              source.add('</script>');
              compilation.assets[OUTPUT_FILENAME] = source;
            }
          );
        });
      }
    }
  ]
};
