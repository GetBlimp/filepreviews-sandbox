import path from 'path'
import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

module.exports = {
  debug: false,

  devtool: 'source-map',

  entry: './app/index.js',

  stats: {
    colors: true,
    reasons: false
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'fp-sandbox.js',
    publicPath: '/'
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      output: { comments: false },
      compress: { warnings: false },
      minimize: true
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new ExtractTextPlugin('fp-sandbox.css')
  ],

  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel?optional[]=runtime&stage=0'],
      include: path.join(__dirname, 'app'),
      exclude: /node_modules|bower_components/
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract(
        'style-loader', 'css-loader', 'autoprefixer-loader'
      ),
      include: path.join(__dirname, 'app'),
      exclude: /node_modules|bower_components/
    }]
  },

  resolve: {
    extensions: ['', '.js', '.css'],
    modulesDirectories: ['app', 'node_modules', 'bower_components']
  }
}
