const { Compilation, ProvidePlugin } = require('webpack');
const { ConcatSource, RawSource } = require('webpack-sources');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (outputName, production) => ({
  entry: './src/initialize.tsx',
  mode: production ? 'development' : 'production',
  // sourcemaps don't work; generated code is readable anyawys
  devtool: false,
  optimization: {
    minimize: production,
    minimizer: production
      ? [new TerserPlugin({
        test: /.*/,
        parallel: true,
        extractComments: {
          banner: false
        }
      })]
      : []
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
    filename: outputName
  },
  plugins: [
    new ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
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
              if (!production) source.add('<script>\n');
              else source.add('<script>');
              source.add(compilation.assets[outputName]);
              if (!production) source.add('\n</script>\n');
              else source.add('</script>');
              compilation.assets[outputName] = source;
            }
          );
        });
      }
    }
  ]
});
