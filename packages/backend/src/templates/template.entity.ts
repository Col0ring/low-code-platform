import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm'
import { UserEntity } from '../users/user.entity'
import { AppEntity } from '../apps/app.entity'

@Entity({
  name: 'template',
})
export class TemplateEntity {
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

  @OneToOne(() => AppEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'appId', referencedColumnName: 'id' })
  app: AppEntity

  @ManyToOne(() => UserEntity, (user) => user.apps, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity
}
