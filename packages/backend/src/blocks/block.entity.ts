import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { UserEntity } from '../users/user.entity'

@Entity({
  name: 'block',
})
export class BlockEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ type: 'text' })
  content: string

  @ManyToOne(() => UserEntity, (user) => user.blocks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity
}
