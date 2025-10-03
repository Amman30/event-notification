import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEventDTO {
  @ApiProperty({ example: 'Meeting', description: 'Title of the event' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Discuss project updates',
    description: 'Description of the event',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: '2023-10-01T10:00:00Z',
    description: 'Date and time of the event in ISO 8601 format',
  })
  @IsNotEmpty()
  dateTime: Date;
}
