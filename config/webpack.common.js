const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const htmlPages = require('./webpack.pages.js')

const webpack = require('webpack')
const path = require('path')
const projectRoot = path.resolve(__dirname, '..')

module.exports = {
  entry: {
    shared: './src/javascript/shared.js',
    home: './src/javascript/home.js',
    diagnostics: './src/javascript/diagnostics.js',
    'diagnostics-test': './src/javascript/diagnostics-test.js',
    timeline: './src/javascript/timeline.js',
    articles: './src/javascript/articles.js',
    object: './src/javascript/object.js',
    'object-from': './src/javascript/object-from-static.js',
    'guide-robot': './src/javascript/guide-robot.js',
    'guide-found-footage': './src/javascript/guide-found-footage.js',
    'guide-pagan-cults': './src/javascript/guide-pagan-cults.js',
    'guide-survival-horror': './src/javascript/guide-survival-horror.js',
    'guide-body-horror': './src/javascript/guide-body-horror.js',
    'guide-without-monster': './src/javascript/guide-without-monster.js',
    'guide-scandinavian': './src/javascript/guide-scandinavian.js',
    'guide-child-imagery': './src/javascript/guide-child-imagery.js',
    'guide-paper-nightmares': './src/javascript/guide-paper-nightmares.js',
    'guide-gothic': './src/javascript/guide-gothic.js',
    search: './src/javascript/search.js',
    routes: './src/javascript/routes.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve('.', 'docs'),
    publicPath: '/chillshse/',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      },
      {
        test: /\.html$/i,
        loader: 'html-loader'
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext][query]'
        }
      },
      {
        test: /\.(ttf|otf|woff|woff2)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext][query]'
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        { from: path.join(projectRoot, 'airtable-secret.js'), to: 'airtable-secret.js', noErrorOnMissing: true },
        { from: path.join(projectRoot, 'src/assets'), to: 'assets' }
      ]
    }),
    ...htmlPages
  ],
  optimization: {
    minimizer: [new CssMinimizerPlugin()]
  },
  resolve: {
    fallback: {
      stream: require.resolve('stream-browserify')
    }
  }
}
