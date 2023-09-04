module.exports = /** @type { import('webpack').Configuration } */ ({
  entry: './src/index.ts',
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
      {
        test: /\.ejs$/,
        loader: 'ejs-webpack-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
});
