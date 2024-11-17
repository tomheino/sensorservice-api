// update-sensor.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSensorDto {
  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  location?: string;
}
