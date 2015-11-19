import path from 'path'
import webpack from 'webpack'

module.exports = {
  devtool: 'eval-source-map',

  entry: [
    'webpack-hot-middleware/client',
    './app/index'
  ],

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.js',
    publicPath: '/assets/'
  },

  module: {
    loaders: [{
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.js$/,
      loaders: ['babel?optional[]=runtime&stage=0'],
      include: path.join(__dirname, 'app'),
      exclude: /node_modules|bower_components/
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader!autoprefixer-loader',
      include: path.join(__dirname, 'app'),
      exclude: /node_modules|bower_components/
    }]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],

  resolve: {
    extensions: ['', '.js', '.css'],
    modulesDirectories: ['app', 'node_modules', 'bower_components']
  }
}
