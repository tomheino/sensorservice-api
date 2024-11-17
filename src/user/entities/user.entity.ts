// import { ApiProperty } from "@nestjs/swagger";
// import { Sensor } from "src/sensor/entities/sensor.entity";
// import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

// @Entity()
// export class User {
//     @ApiProperty()
//     @PrimaryGeneratedColumn()
//     id: number;

//     @ApiProperty()
//     @Column({unique: true})
//     username: string;

//     @ApiProperty()
//     @Column()
//     password: string;

//     @ApiProperty()
//     @Column()
//     firstName: string;

//     @ApiProperty()
//     @Column()
//     lastName: string;

//     @ApiProperty()
//     @OneToMany(() => Sensor, (sensor) => sensor.user, {cascade: true})
//     sensors?: Sensor[]
// }
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Sensor } from '../../sensor/entities/sensor.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @Exclude() // Tämä piilottaa salasanan serialisoitaessa
  password: string;

  @OneToMany(() => Sensor, (sensor) => sensor.user)
  sensors?: Sensor[];
}
