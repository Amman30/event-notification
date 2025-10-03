import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { EventEntity, NotificationEntity } from 'src/common/database';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly FIVE_MINUTES_MS = 5 * 60 * 1000;

  constructor(
    @InjectRepository(EventEntity)
    private readonly eventsRepository: Repository<EventEntity>,

    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  /**
   * Cron job: runs every 5 minutes (configurable via CRON_EXPRESSION)
   */
  @Cron(process.env.CRON_EXPRESSION || '*/5 * * * *', {
    timeZone: 'UTC',
  })
  async handleCron(): Promise<void> {
    this.logger.debug('Cron job started: checking for events...');

    try {
      const events = await this.findPastEvents();
      if (events.length === 0) {
        this.logger.debug('No events found within the last 5 minutes.');
        return;
      }

      await this.createNotifications(events);
    } catch (error) {
      this.logger.error('Cron job failed', error.stack || error.message);
    }
  }

  /**
   * Find events scheduled before 5 minutes ago
   */
  private async findPastEvents(): Promise<EventEntity[]> {
    const now = new Date();
    const fiveMinutesAgo = new Date(Date.now() - this.FIVE_MINUTES_MS);
    return await this.eventsRepository.find({
      where: { dateTime: Between(fiveMinutesAgo, now) },
    });
  }

  /**
   * Create notifications for a list of events
   */
  private async createNotifications(events: EventEntity[]): Promise<void> {
    const eventIds = events.map((e) => e.id);
    const existingNotifications = await this.notificationRepository.find({
      where: { event: { id: In(eventIds) } },
    });

    if (existingNotifications.length > 0) {
      console.log(
        `Notifications already exist for ${existingNotifications.length} event(s). Skipping creation.`,
      );
      return;
    }

    const notifications = events.map((event) =>
      this.notificationRepository.create({
        message: `Event "${event.title}" was scheduled at ${this.formatDate(
          event.dateTime,
        )}`,
        event,
      }),
    );

    await this.notificationRepository.save(notifications);

    notifications.forEach((n) =>
      this.logger.log(`Notification created: ${n.message}`),
    );
  }

  /**
   * Format date for logs and messages
   */
  private formatDate(date: Date): string {
    return date.toLocaleString('en-US', {
      timeZone: process.env.TZ || 'Europe/Brussels',
    });
  }
}
