// sensor-data.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Sensor } from './sensor.entity';

@Entity()
export class SensorData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  temperature: number;

  @Column('float')
  humidity: number;

  @CreateDateColumn()
  timestamp: Date;  // Automaattinen aikaleima

  @ManyToOne(() => Sensor, (sensor) => sensor.measuredValues)  // Muutettu onDelete ja asetettu nullable: true
  sensor: Sensor;
}

