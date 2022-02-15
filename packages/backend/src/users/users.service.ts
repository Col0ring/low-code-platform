import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { getExcludeSelect } from '../database/database.util'
import { Repository } from 'typeorm'
import { User } from './user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  insertUser(user: Partial<User>) {
    return this.usersRepository.save(this.usersRepository.create(user))
  }

  findAll() {
    return this.usersRepository.findAndCount()
  }

  findOneById(id: number) {
    return this.usersRepository.findOne(id)
  }

  findOneByPhoneWithPassword(phone: string) {
    return this.usersRepository.findOne({
      where: {
        phone,
      },
      select: getExcludeSelect(this.usersRepository),
    })
  }

  updateOneById(id: number, partialEntity: Partial<User>) {
    return this.usersRepository.update(id, {
      ...partialEntity,
    })
  }
}
