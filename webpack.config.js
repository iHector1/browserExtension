const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = (env, options) => ({
  entry: [
    'babel-polyfill',
    './src/index.js',
  ],
  output: {
    path: path.join(__dirname, 'public'),
    filename: `app.js?${(+new Date).toString(32).substr(-5)}`,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
    })
  ]
});
