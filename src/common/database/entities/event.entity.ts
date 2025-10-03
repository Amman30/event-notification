import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { NotificationEntity } from './notification.entity';

@Entity('events')
export class EventEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'timestamptz' })
  dateTime: Date;

  @OneToMany(() => NotificationEntity, (notification) => notification.event, {
    eager: true,
  })
  notifications: NotificationEntity[];
}
