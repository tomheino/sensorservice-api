// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
// import { User } from 'src/user/entities/user.entity';

// @Entity()
// export class Sensor {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   name: string;

//   @Column()
//   location: string;

//   @Column("json", { nullable: true })
//   measuredValues: { humidity: number, temperature: number, timestamp: string }[]; // JSON array to store measured values

//   @ManyToOne(() => User, user => user.sensors) // Suhde käyttäjään
//   user: User;
// }

// sensor.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { SensorData } from './sensor-data.entity';

@Entity()
export class Sensor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @ManyToOne(() => User, (user) => user.sensors, { cascade: true })
  user: User;

  @OneToMany(() => SensorData, (sensorData) => sensorData.sensor)
  measuredValues: SensorData[];
  
  @Column({ default: false })
  temperatureAlert: boolean;

  @Column({ default: false })
  humidityAlert: boolean;

  @Column('simple-array', { default: '18,25' }) // Esimerkkiarvo: [18, 25] (lämpötilan alaraja ja yläraja)
  temperatureRange: number[];

  @Column('simple-array', { default: '30,60' }) // Esimerkkiarvo: [30, 60] (kosteuden alaraja ja yläraja)
  humidityRange: number[];

}
