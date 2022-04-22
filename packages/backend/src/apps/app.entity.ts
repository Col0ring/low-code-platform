import { PageEntity } from '../pages/page.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { UserEntity } from '../users/user.entity'

@Entity({
  name: 'app',
})
export class AppEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({
    nullable: true,
  })
  desc: string

  @Column({
    nullable: true,
  })
  icon: string

  // 1 已启用，0 未启用
  @Column({
    type: 'int',
    default: 0,
  })
  status: number

  @OneToMany(() => PageEntity, (page) => page.app)
  pages: PageEntity[]

  @ManyToOne(() => UserEntity, (user) => user.apps, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  // 1 是，0 否
  @Column({
    type: 'int',
    default: 0,
  })
  isTemplate: number
}
