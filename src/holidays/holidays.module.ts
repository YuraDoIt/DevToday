import { Module } from '@nestjs/common';
import { HolidaysService } from './holidays/holidays.service';

@Module({
  providers: [HolidaysService]
})
export class HolidaysModule {}
