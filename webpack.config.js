const { ConcatSource } = require('webpack-sources');

module.exports = {
  entry: './src/index.tsx',
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
    filename: 'output.html'
  },
  plugins: [
    {
      // wrap output in script tags
      // pile of hacks
      apply(compiler) {
        compiler.hooks.compilation.tap('ScriptWrapPlugin', compilation => {
          compilation.hooks.processAssets.tapPromise(
            'ScriptWrapPlugin',
            async () => {
              const source = new ConcatSource();
              source.add('<script>\n');
              source.add(compilation.assets['output.html']);
              source.add('\n</script>\n');
              compilation.assets['output.html'] = source;
            }
          );
        });
      }
    }
  ]
};
