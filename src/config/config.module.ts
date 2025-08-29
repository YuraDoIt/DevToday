import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule as NestConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarEventEntity } from '../calendar/entities/calendar-event.entity';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: 'sqlite',
        database: 'db.sqlite',
        entities: [UserEntity, CalendarEventEntity],
        synchronize: true, 
      }),
    }),
  ],
})
export class ConfigModule {}
