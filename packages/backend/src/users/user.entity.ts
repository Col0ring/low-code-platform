import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import bcrypt from 'bcrypt'
@Entity({
  name: 'user',
})
export class User {
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

  @Column({
    default: null,
    select: false,
    nullable: true,
  })
  refreshToken: string
}
