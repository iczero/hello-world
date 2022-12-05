const { Compilation, ProvidePlugin } = require('webpack');
const { ConcatSource, RawSource } = require('webpack-sources');

module.exports = (outputName, spaceTags) => ({
  entry: './src/initialize.tsx',
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.txt/,
        type: 'asset/source'
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
              if (spaceTags) source.add('<script>\n');
              else source.add('<script>');
              source.add(compilation.assets[outputName]);
              if (spaceTags) source.add('\n</script>\n');
              else source.add('</script>');
              compilation.assets[outputName] = source;
            }
          );
        });
      }
    }
  ]
});
