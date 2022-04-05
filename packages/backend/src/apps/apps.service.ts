import { Injectable } from '@nestjs/common'
import MemoryFS from 'memory-fs'
import path from 'path'
import { webpack } from 'webpack'
import { getWebpackConfig, WebpackConfigOptions } from './webpack.config'

const memFs = new MemoryFS()

function getZip(options: WebpackConfigOptions) {
  const webpackConfig = getWebpackConfig(options)
  const compiler = webpack(webpackConfig)
  compiler.outputFileSystem = memFs

  return new Promise<Buffer>((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err || (stats && stats.hasErrors())) {
        reject({
          err,
          stats,
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
}
@Injectable()
export class AppsService {
  buildApp(options: WebpackConfigOptions) {
    return getZip(options)
  }
}
