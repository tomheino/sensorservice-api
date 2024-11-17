// create-sensor.dto.ts
import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateSensorDto {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsNumber()
  userId: number;

  @IsArray()
  measuredValues: { humidity: number; temperature: number }[]; // Kosteus ja lämpötila
}
