const path = require('path');

module.exports = {
  mode: 'development',  // Aquí defines el modo. Puedes cambiarlo a 'production' cuando estés listo para el despliegue.
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$|jsx/,  // Añadir soporte para archivos .js y .jsx
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],  // Asegúrate de que Webpack resuelva archivos .js y .jsx
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 9000,
  },
};
