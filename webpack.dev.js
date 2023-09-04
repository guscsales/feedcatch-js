const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = /** @type { import('webpack').Configuration } */ merge(
  commonConfig,
  {
    mode: 'development',
    output: {
      filename: 'feedcatch.js',
      path: path.resolve(__dirname, 'playground', 'dist'),
    },
    plugins: [
      new Dotenv({
        path: './.env.development',
      }),
    ],
  }
);
