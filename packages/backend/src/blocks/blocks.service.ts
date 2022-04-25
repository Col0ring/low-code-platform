import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UsersService } from '../users/users.service'
import { ILike, Repository } from 'typeorm'
import { BlockEntity } from './block.entity'
import { BlockCreateDto } from './dto/create.dto'
import { BlockUpdateDto } from './dto/update.dto'

@Injectable()
export class BlocksService {
  constructor(
    @InjectRepository(BlockEntity)
    private readonly blocksRepository: Repository<BlockEntity>,
    private readonly usersService: UsersService
  ) {}
  async list(userId: number, search: string) {
    return this.blocksRepository.findAndCount({
      where: {
        name: ILike(`%${search}%`),
        user: { id: userId },
      },
    })
  }
  async create(userId: number, blockCreateDto: BlockCreateDto) {
    const block = this.blocksRepository.create(blockCreateDto)
    const user = await this.usersService.findOneById(userId)
    block.user = user
    return this.blocksRepository.save(block)
  }
  async delete(blockId: number, userId: number) {
    return this.blocksRepository.delete({
      id: blockId,
      user: {
        id: userId,
      },
    })
  }
  async update(
    blockId: number,
    userId: number,
    blockUpdateDto: BlockUpdateDto
  ) {
    return this.blocksRepository.update(
      {
        id: blockId,
        user: {
          id: userId,
        },
      },
      {
        name: blockUpdateDto.name,
      }
    )
  }
}
