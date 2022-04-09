import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AppsService } from 'src/apps/apps.service'
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
      ...pageCreateDto,
      content: '[]',
    })
    const app = await this.appsService.one(pageCreateDto.appId)
    page.app = app
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
    console.log(pageUpdateDto)
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
