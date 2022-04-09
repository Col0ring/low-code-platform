import webpack, { Chunk, Module } from 'webpack'
import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ZipWebpackPlugin from 'zip-webpack-plugin'
// 提出 css
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
// 压缩 css
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
// 压缩 js
import TerserWebpackPlugin from 'terser-webpack-plugin'
import { safeJsonParser } from '../utils'
export interface WebpackConfigOptions {
  title: string
  pages: string[]
}

export function getWebpackConfig({
  pages,
  title,
}: WebpackConfigOptions): webpack.Configuration {
  return {
    mode: 'production',
    entry: path.resolve(__dirname, '../../templates/index.tsx'),
    output: {
      filename: `js/[name].js`,
      path: path.resolve(__dirname, '../../templates/dist'),
      publicPath: './',
    },
    optimization: {
      splitChunks: {
        // include all types of chunks
        chunks: 'all',
        name(module: Module, chunks: Chunk[], cacheGroupKey: string) {
          const moduleFileName = module
            .identifier()
            .split('/')
            .reduceRight((item) => item)
          const allChunksNames = chunks.map((item) => item.name).join('~')
          return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`
        },
      },
      minimize: true,
      minimizer: [
        new CssMinimizerPlugin(),
        new TerserWebpackPlugin({
          extractComments: false,
          terserOptions: {
            compress: { pure_funcs: ['console.log'] },
          },
        }),
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[name].[contenthash:8].css',
        ignoreOrder: false,
      }),
      new ZipWebpackPlugin({
        extension: 'zip',
        path: path.resolve(__dirname, '../../templates/dist'),
        filename: 'dist.zip',
      }),
      new HtmlWebpackPlugin({
        minify: true,
        cache: false,
        filename: 'index.html',
        template: path.resolve(__dirname, '../../templates/index.html'),
        title,
      }),
      // 注入 json
      new webpack.DefinePlugin({
        process: {
          env: {
            PAGES: pages.map((page) => safeJsonParser(page, [])),
          },
        },
      }),
    ],
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    },
    module: {
      rules: [
        {
          test: /.(ts|js)x?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env',
                  '@babel/preset-react',
                  '@babel/preset-typescript',
                ],
              },
            },
          ],
          // 指定范围
          exclude: /node_modules/,
          include: path.resolve(__dirname, '../../templates'),
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: false,
              },
            },
          ],
        },
        {
          test: /\.less$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: false,
                importLoaders: 1,
              },
            },
            'less-loader',
          ],
        },
        // 静态资源构建能力
        {
          test: /\.(ttf|woff|woff2|eot|otf)$/,
          // 相当于 file-loader
          type: 'asset/resource',
          generator: {
            // [ext]前面自带"."
            filename: 'assets/fonts/[name].[contenthash:8][ext]',
          },
        },
        {
          test: /\.(png|jpe?g|svg|gif|webp)$/,
          // 相当于 url-loader 的自动根据文件大小的配置能力
          type: 'asset',
          generator: {
            filename: 'assets/images/[name].[contenthash:8][ext]',
          },
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024, // 8kb
            },
          },
        },
      ],
    },
  }
}
