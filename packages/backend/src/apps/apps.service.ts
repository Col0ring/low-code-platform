import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import MemoryFS from 'memory-fs'
import path from 'path'
import { UsersService } from '../users/users.service'
import { ILike, Repository } from 'typeorm'
import { webpack } from 'webpack'
import { AppEntity } from './app.entity'
import { AppCreateDto } from './dto/create.dto'
import { getWebpackConfig, WebpackConfigOptions } from './webpack.config'
import { SearchAppStatus, TemplateStatus } from './constants'
import { AppSearchDto } from './dto/search.dto'
import { AppUpdateDto } from './dto/update.dto'
import { PageEntity } from '../pages/page.entity'
import { AppCreateByTemplateDto } from './dto/templateCreate.dto'

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
  constructor(
    @InjectRepository(AppEntity)
    private readonly appsRepository: Repository<AppEntity>,
    @InjectRepository(PageEntity)
    private readonly pagesRepository: Repository<PageEntity>,
    private readonly userService: UsersService
  ) {}
  buildApp(options: WebpackConfigOptions) {
    return getZip(options)
  }

  async list(
    userId: number,
    pageSize: number,
    page: number,
    { search, searchOrder, searchStatus }: AppSearchDto
  ) {
    return this.appsRepository.findAndCount({
      take: pageSize,
      skip: pageSize * (page - 1),
      where: {
        status: searchStatus === SearchAppStatus.All ? undefined : searchStatus,
        name: ILike(`%${search}%`),
        user: { id: userId },
        isTemplate: TemplateStatus.No,
      },
      order: {
        [searchOrder === 'create' ? 'created_at' : 'updated_at']: 'DESC',
      },
    })
  }
  async create(userId: number, appCreateDto: AppCreateDto) {
    const app = this.appsRepository.create(appCreateDto)
    const user = await this.userService.findOneById(userId)
    app.user = user
    return this.appsRepository.save(app)
  }

  async createByTemplate(
    userId: number,
    { templateAppId, ...appCreateDto }: AppCreateByTemplateDto
  ) {
    const { pages } = await this.one(templateAppId)
    const app = this.appsRepository.create(appCreateDto)
    const user = await this.userService.findOneById(userId)
    app.user = user
    const newApp = await this.appsRepository.save(app)
    await this.pagesRepository.save(
      this.pagesRepository.create(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        pages.map(({ id, ...pageProp }) => ({
          ...pageProp,
          app: newApp,
        }))
      )
    )
    return newApp
  }
  async update(appId: number, appUpdateDto: AppUpdateDto) {
    return this.appsRepository.update(appId, appUpdateDto)
  }
  async delete(appId: number) {
    return this.appsRepository.delete(appId)
  }
  async one(appId: number) {
    return this.appsRepository.findOne({
      where: {
        id: appId,
      },
      relations: ['pages'],
    })
  }
}
