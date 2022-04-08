import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { getExcludeSelect } from '../database/database.util'
import { Repository } from 'typeorm'
import { UserEntity } from './user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>
  ) {}

  insertUser(user: Partial<UserEntity>) {
    return this.usersRepository.save(this.usersRepository.create(user))
  }

  findAll() {
    return this.usersRepository.findAndCount()
  }

  findOneById(id: number) {
    return this.usersRepository.findOne({
      where: {
        id,
      },
    })
  }

  findOneByIdWithRefreshToken(id: number) {
    return this.usersRepository.findOne({
      where: {
        id,
      },
      select: getExcludeSelect(this.usersRepository, ['password']),
    })
  }

  findOneByPhoneWithPassword(phone: string) {
    return this.usersRepository.findOne({
      where: {
        phone,
      },
      select: getExcludeSelect(this.usersRepository),
    })
  }

  updateOneById(id: number, partialEntity: Partial<UserEntity>) {
    return this.usersRepository.update(id, {
      ...partialEntity,
    })
  }
  updateOneByPhone(phone: string, partialEntity: Partial<UserEntity>) {
    return this.usersRepository.update(
      {
        phone,
      },
      {
        ...partialEntity,
      }
    )
  }
}
