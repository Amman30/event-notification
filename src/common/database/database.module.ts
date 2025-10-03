import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EventEntity } from './entities/event.entity';
import { NotificationEntity } from './entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => {
        const host: string = String(config.get('database.host') ?? 'localhost');
        const port: number =
          Number(config.get('database.port') ?? 5432) || 5432;
        const username: string = String(
          config.get('database.username') ?? 'postgres',
        );
        const password: string = String(
          config.get('database.password') ?? 'postgres',
        );
        const database: string = String(
          config.get('database.name') ?? 'foodz_db',
        );

        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          entities: [EventEntity, NotificationEntity],
          synchronize: true,
          ssl: true,
          extra: {
            ssl: {
              rejectUnauthorized: false,
            },
          },
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
