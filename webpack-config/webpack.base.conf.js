const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const BeautifyHtmlWebpackPlugin = require('beautify-html-webpack-plugin')
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin')
// const SpritesmithPlugin = require('webpack-spritesmith')
const WebpackHtmlValidatePlugin = require('webpack-html-validate-plugin')
const ImageminPlugin = require("imagemin-webpack")
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

// Main const
// see more: /README.md#main-const
const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
  assets: 'assets/'
}

const PAGES_DIR = `${PATHS.src}/pug/pages/`
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'))

module.exports = {
  // BASE config
  externals: {
    paths: PATHS
  },
  entry: {
    script: PATHS.src,
    // module: `${PATHS.src}/your-module.js`,
  },
  output: {
    filename: `${PATHS.assets}js/[name].[hash].js`,
    path: PATHS.dist,
    // publicPath: './'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [{
        test: /\.pug$/,
        loader: 'pug-loader'
      },
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        // loader: 'babel-loader',
        use: [
          'babel-loader',
          'eslint-loader'
        ]
      },
      // {
      //   test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
      //   loader: 'file-loader',
      //   options: {
      //     name: '[name].[ext]'
      //   }
      // },
      // {
      //   test: /\.(png|jpg|gif|svg)$/,
      //   loader: 'file-loader',
      //   options: {
      //     name: '[name].[ext]'
      //   }
      // },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              url: false
            }
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true }
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: true }
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true, }
          }
        ]
      },
      {
        // test: /\.png$/,
        test: /sprites-png(\/|\\).+\.png$/,
        use: [
          'file-loader?name=i/[hash].[ext]'
        ]
      }
    ]
  },
  resolve: {
    alias: {
      '~': PATHS.src
    },
    modules: ["node_modules", "spritesmith-generated"]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: `${PATHS.assets}css/style.[hash].css`,
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: `${PATHS.src}/${PATHS.assets}img`, to: `${PATHS.assets}img` },
        { from: `${PATHS.src}/${PATHS.assets}fonts`, to: `${PATHS.assets}fonts` },
        { from: `${PATHS.src}/static`, to: '' },
      ]
    }),
    // only until new HtmlWebpackPlugin
    new SVGSpritemapPlugin(
      `${PATHS.src}/inline-svg/**/*.svg`, {
        output: {
          svgo: true
        },
        sprite: {
          generate: {
            title: false
          }
        }
      }),
    // Automatic creation any html pages (Don't forget to RERUN dev server)
    // see more: README.md#create-another-html-files
    // best way to create pages: README.md#third-method-best
    ...PAGES.map(page => new HtmlWebpackPlugin({
      template: `${PAGES_DIR}/${page}`,
      filename: `./${page.replace(/\.pug/, '.html')}`,
      minify: false
    })),
    // Beautify Html
    new BeautifyHtmlWebpackPlugin({
      "indent_size": "2",
      "indent_char": " ",
      "max_preserve_newlines": "0",
      "preserve_newlines": true,
      "keep_array_indentation": true,
      "break_chained_methods": false,
      "indent_scripts": "normal",
      "brace_style": "collapse",
      "space_before_conditional": true,
      "unescape_strings": false,
      "jslint_happy": false,
      "end_with_newline": false,
      "wrap_line_length": "0",
      "indent_inner_html": false,
      "comma_first": false,
      "e4x": true,
      "indent_empty_lines": false
    }),
    // new SpritesmithPlugin({
    //   src: {
    //     cwd: `${PATHS.src}/sprites-png`,
    //     glob: '*.png'
    //   },
    //   target: {
    //     image: `${PATHS.dist}/assets/sprite/sprite.png`,
    //     css: `${PATHS.src}/assets/scss/sprite/sprite.scss`
    //   },
    //   apiOptions: {
    //     cssImageRef: '../sprite/sprite.png'
    //   }
    // }),
    new WebpackHtmlValidatePlugin()
  ],
}
