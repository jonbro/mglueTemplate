const path = require('path');

module.exports = {
  entry: './client_src/basicGame.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader'
      }
    ]
  },
  devtool: 'source-map',
  watch: true,
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'client.js',
    path: path.resolve(__dirname, 'public')
  }
};