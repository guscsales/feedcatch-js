const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = /** @type { import('webpack').Configuration } */ ({
  entry: './src/index.ts',
  output: {
    filename: 'feedcatch.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [/node_modules/, /\.html$/],
      },
      {
        test: /\.(s*)css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.ttf$/,
        use: {
          loader: 'file-loader', // or 'url-loader' if you prefer
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/', // Customize the output path if needed
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'playground/index.html',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'playground'),
      watch: true,
    },
    compress: true,
    port: 9000,
  },
});
