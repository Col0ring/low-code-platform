import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { getZip } from './getZip'

const app = express()

app.use(bodyParser.json())
app.use(cors())

app.get('/api/download', async (req, res) => {
  try {
    const buffer = await getZip()
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition')
    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader(
      'Content-Disposition',
      'attachment;filename=dist.zip;filename*=UTF-8'
    )
    res.send(buffer)
  } catch (error) {
    res.send(error)
  }
})

app.listen(3001, () => {
  console.log('listening on http://localhost:3001')
})全部已读Coloring(临泮)11:29import webpack from 'webpack'
import path from 'path'
import MemoryFS from 'memory-fs'
import webpackConfig from './webpack.config'

const compiler = webpack(webpackConfig)
const memFs = new MemoryFS()

compiler.outputFileSystem = memFs

export function getZip() {
  return new Promise<Buffer>((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err || (stats && stats.hasErrors())) {
        reject({
          err,
          stats
        })
      } else {
        compiler.outputFileSystem.readFile(
          path.resolve(webpackConfig.output?.path || '', 'dist.zip'),
          (err, buffer) => {
            if (!err) {
              resolve(buffer as Buffer)
            } else {
              reject(err)
            }
          }
        )
      }
    })
  })
}全部已读Coloring(临泮)11:30import path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ZipWebpackPlugin from 'zip-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

const webpackConfig: webpack.Configuration = {
  mode: 'production',
  entry: path.resolve(__dirname, './templates/index.tsx'),
  output: {
    filename: `js/[name].js`,
    path: path.resolve(__dirname, './dist'),
    publicPath: './'
  },
  plugins: [
    new ZipWebpackPlugin({
      extension: 'zip',
      path: path.resolve(__dirname, './dist'),
      filename: 'dist.zip'
    }),
    new HtmlWebpackPlugin({
      minify: true,
      cache: false,
      filename: 'index.html',
      template: path.resolve(__dirname, './templates/index.html'),
      title: 'Test'
    }),
    new CleanWebpackPlugin(),
    // 注入 json
    new webpack.DefinePlugin({
      process: {
        env: {
          JSON_CONFIG: {
            1: 1
          }
        }
      }
    })
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
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
                [
                  '@babel/preset-env',
                  {
                    // 防止babel将任何模块类型都转译成CommonJS类型，导致tree-shaking失效问题
                    modules: false,
                    // 只导入需要的 polyfill
                    useBuiltIns: 'usage',
                    // 指定 corjs 版本
                    corejs: 3,
                    targets: {
                      browsers: ['last 2 versions'] // 最近 2 个版本的浏览器
                    }
                  }
                ],
                // 转jsx
                '@babel/preset-react',
                '@babel/preset-typescript'
              ],
              // @babel/runtime-corejs3 是辅助函数
              plugins: [
                // 开发库/工具、移除冗余工具函数(helper function)
                [
                  '@babel/plugin-transform-runtime',
                  {
                    corejs: {
                      version: 3,
                      proposals: true
                    },
                    useESModules: true
                  }
                ]
              ]
            }
          }
        ],
        // 指定范围
        exclude: /node_modules/,
        include: path.resolve(__dirname, './templates')
      }
    ]
  }
}

export default webpackConfig全部已读Coloring(临泮)11:30import React, { useState } from 'react'
import axios from 'axios'
import logo from './logo.svg'
import './App.css'
function down(blob: Blob, filename: string) {
  var blobURL = window.URL.createObjectURL(blob)
  var a = document.createElement('a')
  a.href = blobURL
  // 表示下载的
  a.download = filename
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  a.parentNode?.removeChild(a)
  window.URL.revokeObjectURL(blobURL)
}

function App() {
  const [count, setCount] = useState(0)
  const handleDownload = () => {
    axios
      .get('http://localhost:3001/api/download', {
        responseType: 'blob'
      })
      .then((res) => {
        let filename = 'dist.zip'
        const ctx: string = res.headers['content-disposition']
        if (ctx) {
          filename = decodeURIComponent(ctx.split(';')[1].split('filename=')[1])
        }
        down(res.data, filename)
      })
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
      <button onClick={handleDownload}>download</button>
    </div>
  )
}

export default App
