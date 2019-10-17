const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'inline-source-map',
  entry: './src/index.ts',
  resolve: {
    extensions: ['.tsx', '.ts', '.mjs', '.js', '.json', '.jsx'],
    plugins: [
      // https://www.npmjs.com/package/tsconfig-paths-webpack-plugin
      new TsconfigPathsPlugin({ configFile: path.resolve(__dirname, 'tsconfig.json') }),
    ],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          projectReferences: true,
        },
      },
    ],
  },
  stats: 'minimal',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
  },
  plugins: [new HtmlWebpackPlugin()],
}
