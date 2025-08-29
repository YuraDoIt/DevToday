import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsNotEmpty, IsInt } from 'class-validator';

export class AddHolidaysDto {
  @ApiProperty({ example: 'US' })
  @IsString()
  @IsNotEmpty()
  countryCode: string;

  @ApiProperty({ example: 2025 })
  @IsInt()
  year: number;

  @ApiProperty({
    example: ["New Year's Day", "Independence Day"],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  holidays?: string[];
}
