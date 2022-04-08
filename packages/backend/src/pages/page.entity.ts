import { AppEntity } from '../apps/app.entity'
import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm'
@Entity({
  name: 'page',
})
export class PageEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => AppEntity, (app) => app.pages)
  @JoinColumn({ name: 'appId', referencedColumnName: 'id' })
  app: AppEntity

  @Column()
  name: string

  // 1 已启用，0 未启用
  @Column({
    type: 'int',
    default: 0,
  })
  status: number

  // json
  @Column()
  content: string
}