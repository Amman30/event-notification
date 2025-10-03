import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDTO } from 'src/common/dtos/Event/event.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiResponse({
    status: 201,
    description: 'The event has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid input data.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
  })
  @ApiBody({ type: CreateEventDTO })
  @Post()
  async createEventController(@Body() dto: CreateEventDTO) {
    try {
      return await this.eventsService.createEvent(dto);
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  @ApiResponse({
    status: 200,
    description: 'The event has been successfully retrieved.',
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found.',
  })
  @Get(':id')
  async getEventByIdController(@Param('id') id: string) {
    try {
      return await this.eventsService.findEventById(id);
    } catch (error) {
      console.error('Error fetching event by ID:', error);
      throw error;
    }
  }

  @ApiResponse({
    status: 200,
    description: 'All events have been successfully retrieved.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
  })
  @Get()
  async getAllEventsController() {
    try {
      return await this.eventsService.findAllEvents();
    } catch (error) {
      console.error('Error fetching all events:', error);
      throw error;
    }
  }
}
