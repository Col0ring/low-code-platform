import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import bcrypt from 'bcrypt'
import { AppEntity } from '../apps/app.entity'
import { BlockEntity } from '../blocks/block.entity'
@Entity({
  name: 'user',
})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    unique: true,
  })
  phone: string

  @Column()
  username: string

  @Column({
    nullable: true,
  })
  avatar: string

  @Column({
    unique: true,
  })
  email: string

  @Column({
    transformer: {
      to(value: string) {
        return bcrypt.hashSync(value, 10)
      },
      from(value) {
        return value
      },
    },
    select: false,
  })
  password: string

  @OneToMany(() => AppEntity, (app) => app.user, {
    onDelete: 'CASCADE',
  })
  apps: AppEntity[]

  @OneToMany(() => BlockEntity, (block) => block.user, {
    onDelete: 'CASCADE',
  })
  blocks: AppEntity[]

  @Column({
    default: null,
    select: false,
    nullable: true,
  })
  refreshToken: string
}
