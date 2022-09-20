const { Compilation, ProvidePlugin } = require('webpack');
const { ConcatSource, RawSource } = require('webpack-sources');

const OUTPUT_FILENAME = 'output-dev.html';

module.exports = {
  entry: './src/initialize.tsx',
  mode: 'development',
  devtool: 'source-map',
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
              // unicode BOM to ensure UTF-8 encoding
              source.add(new RawSource(Buffer.from([0xef, 0xbb, 0xbf])));
              source.add('<script>\n');
              source.add(compilation.assets[OUTPUT_FILENAME]);
              source.add('\n</script>\n');
              compilation.assets[OUTPUT_FILENAME] = source;
            }
          );
        });
      }
    }
  ]
};
