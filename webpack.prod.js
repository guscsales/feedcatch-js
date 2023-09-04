const path = require('path');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const Dotenv = require('dotenv-webpack');

module.exports = /** @type { import('webpack').Configuration } */ merge(
  commonConfig,
  {
    mode: 'production',
    output: {
      filename: 'feedcatch.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new Dotenv({
        path: './.env.production',
      }),
    ],
  }
);
