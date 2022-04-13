import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AppsService } from '../apps/apps.service'
import { Repository } from 'typeorm'
import { PageCreateDto } from './dto/create.dto'
import { PageUpdateDto } from './dto/update.dto'
import { PageEntity } from './page.entity'

@Injectable()
export class PagesService {
  constructor(
    @InjectRepository(PageEntity)
    private readonly pagesRepository: Repository<PageEntity>,
    private readonly appsService: AppsService
  ) {}

  async create(pageCreateDto: PageCreateDto) {
    const page = this.pagesRepository.create({
      content: '',
      ...pageCreateDto,
    })
    const app = await this.appsService.one(pageCreateDto.appId)
    page.app = app
    this.pagesRepository.create()
    return this.pagesRepository.save(page)
  }
  async delete(appId: number, pageId: number) {
    return this.pagesRepository.delete({
      id: pageId,
      app: {
        id: appId,
      },
    })
  }
  async update(appId: number, pageId: number, pageUpdateDto: PageUpdateDto) {
    return this.pagesRepository.update(
      {
        id: pageId,
        app: {
          id: appId,
        },
      },
      pageUpdateDto
    )
  }
  async one(appId: number, pageId: number) {
    return this.pagesRepository.findOne({
      where: {
        id: pageId,
        app: {
          id: appId,
        },
      },
      relations: ['app'],
    })
  }
}
