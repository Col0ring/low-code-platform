import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AppEntity } from '../apps/app.entity'
import { ILike, Repository } from 'typeorm'
import { UsersService } from '../users/users.service'
import { TemplateEntity } from './template.entity'
import { TemplateCreateDto } from './dto/create.dto'
import { AppStatus, TemplateStatus } from '../apps/constants'
import { PageEntity } from '../pages/page.entity'

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(TemplateEntity)
    private readonly templatesRepository: Repository<TemplateEntity>,
    @InjectRepository(AppEntity)
    private readonly appsRepository: Repository<AppEntity>,
    @InjectRepository(PageEntity)
    private readonly pagesRepository: Repository<PageEntity>,
    private readonly userService: UsersService
  ) {}

  async list(pageSize: number, page: number, search: string) {
    return this.templatesRepository.findAndCount({
      take: pageSize,
      skip: pageSize * (page - 1),
      where: {
        name: ILike(`%${search}%`),
      },
      relations: ['app'],
    })
  }
  async myList(userId: number, pageSize: number, page: number, search: string) {
    return this.templatesRepository.findAndCount({
      take: pageSize,
      skip: pageSize * (page - 1),
      where: {
        name: ILike(`%${search}%`),
        user: {
          id: userId,
        },
      },
      relations: ['app'],
    })
  }
  async create(userId: number, { appId, ...dto }: TemplateCreateDto) {
    const template = this.templatesRepository.create(dto)
    const { pages } = await this.appsRepository.findOne({
      where: {
        id: appId,
        user: {
          id: userId,
        },
      },
      relations: ['pages'],
    })
    const app = this.appsRepository.create({
      name: '',
      icon: '',
      desc: '',
      status: AppStatus.Active,
      isTemplate: TemplateStatus.Yes,
    })
    const user = await this.userService.findOneById(userId)
    template.user = user
    app.user = user
    const newApp = await this.appsRepository.save(app)
    template.app = newApp
    await this.pagesRepository.save(
      this.pagesRepository.create(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        pages.map(({ id, ...pageProp }) => ({
          ...pageProp,
          app: newApp,
        }))
      )
    )
    return this.templatesRepository.save(template)
  }

  // async update(appId: number, appUpdateDto: AppUpdateDto) {
  //   return this.appsRepository.update(appId, appUpdateDto)
  // }
  // async delete(appId: number) {
  //   return this.appsRepository.delete(appId)
  // }
  // async one(appId: number) {
  //   return this.appsRepository.findOne({
  //     where: {
  //       id: appId,
  //     },
  //     relations: ['pages'],
  //   })
  // }
}
