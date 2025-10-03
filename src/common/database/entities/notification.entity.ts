import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { EventEntity } from './event.entity';

@Entity('notifications')
export class NotificationEntity extends BaseEntity {
  @Column()
  message: string;

  @ManyToOne(() => EventEntity, (event) => event.notifications, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  event: EventEntity;
}
