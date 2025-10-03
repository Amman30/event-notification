import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventDTO } from 'src/common/dtos/Event/event.dto';
import { EventEntity } from 'src/common/database';
import { Repository } from 'typeorm';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventsRepository: Repository<EventEntity>,
  ) {}

  /*
   * Creates a new event with expected body {title: string, description: string, dateTime: Date}
   */

  async createEvent(dto: CreateEventDTO): Promise<EventEntity> {
    try {
      const existingEvent = await this.eventsRepository.findOneBy({
        title: dto.title,
        dateTime: dto.dateTime,
      });
      switch (true) {
        case !!existingEvent:
          throw new ConflictException(
            `Event with title "${dto.title}" at "${new Date(dto.dateTime).toISOString()}" already exists.`,
          );

        case new Date(dto.dateTime) < new Date():
          throw new ConflictException(
            `Event dateTime "${new Date(dto.dateTime).toISOString()}" is in the past.`,
          );
      }

      const newEvent = this.eventsRepository.create({
        title: dto.title,
        description: dto.description,
        dateTime: dto.dateTime,
      });
      return await this.eventsRepository.save(newEvent);
    } catch (error) {
      console.error('Error creating event:', error);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Could not create event because: ${error}`,
      );
    }
  }

  /*
   * Retrieves all events from the database
   */

  async findAllEvents(): Promise<EventEntity[]> {
    try {
      return await this.eventsRepository.find();
    } catch (error) {
      console.error('Error fetching all events:', error);
      throw new InternalServerErrorException(
        `Could not fetch events because: ${error}`,
      );
    }
  }

  /*
   * Retrieves a single event by its ID
   */

  async findEventById(id: string): Promise<EventEntity> {
    try {
      const event = await this.eventsRepository.findOneBy({ id });
      if (!event) {
        throw new NotFoundException(`Event with ID ${id} not found`);
      }
      return event;
    } catch (error) {
      console.error(`Error fetching event by ID ${id}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Could not fetch event because: ${error}`,
      );
    }
  }
}
