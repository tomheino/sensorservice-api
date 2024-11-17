// // sensor.service.ts
// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Sensor } from './entities/sensor.entity';
// import { UserService } from 'src/user/user.service';
// import { CreateSensorDto } from './dto/create-sensor.dto';

// @Injectable()
// export class SensorService {
//   constructor(
//     @InjectRepository(Sensor)
//     private sensorRepository: Repository<Sensor>,
//     private userService: UserService,
//   ) {}

//   async createSensor(createSensorDto: CreateSensorDto): Promise<Sensor> {
//     const { userId, name, location, measuredValues } = createSensorDto;

//     const user = await this.userService.findUserById(userId.toString());
//     if (!user) {
//       throw new Error('User not found');
//     }

//     // Luo uusi sensori, lisää mitatut arvot aikaleimoineen ISO-muodossa
//     const sensor = this.sensorRepository.create({
//       name,
//       location,
//       user,
//       measuredValues: measuredValues.map(value => ({
//         ...value,
//         timestamp: new Date().toISOString(), // Muuntaa aikaleiman merkkijonoksi
//       })),
//     });

//     // Tallenna sensori tietokantaan
//     return await this.sensorRepository.save(sensor);
//   }
  
//   async getSensorsByUserId(userId: number): Promise<Sensor[]> {
//     return this.sensorRepository.find({
//       where: { user: { id: userId } },
//       relations: ['user'],
//     });
//   }
// }

// ------------------------------------------------ //

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sensor } from './entities/sensor.entity';
import { SensorData } from './entities/sensor-data.entity';
import { UserService } from 'src/user/user.service';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/user/entities/user.entity';
import { UpdateSensorDto } from './dto/update-sensor.dto';

@Injectable()
export class SensorService {
  constructor(
    @InjectRepository(Sensor)
    private sensorRepository: Repository<Sensor>,
    @InjectRepository(SensorData)
    private sensorDataRepository: Repository<SensorData>,
    private userService: UserService,
  ) {}

  // Luodaan uusi sensori
  async createSensor(createSensorDto: CreateSensorDto): Promise<Sensor> {
    const { userId, name, location } = createSensorDto;

    // Haetaan käyttäjä ja poistetaan salasana ennen sen käyttämistä
    const user = await this.userService.findUserById(userId.toString());
    if (!user) {
      throw new Error('User not found');
    }

    // Luo uusi sensori ja tallenna
    const sensor = this.sensorRepository.create({ name, location, user });
    const savedSensor = await this.sensorRepository.save(sensor);

    // Palautetaan sensori ilman käyttäjän salasanaa
    savedSensor.user = plainToInstance(User, savedSensor.user);  // Poistaa salasanan käyttäjältä
    return savedSensor;
  }

  async updateSensor(
    id: number,
    updateSensorDto: UpdateSensorDto,
  ): Promise<Sensor> {
    // Haetaan sensori tietokannasta
    const sensor = await this.sensorRepository.findOne({ where: { id } });

    if (!sensor) {
      throw new Error('Sensor not found');
    }

    // Päivitetään sensorin tiedot
    if (updateSensorDto.name) sensor.name = updateSensorDto.name;
    if (updateSensorDto.location) sensor.location = updateSensorDto.location;

    // Tallennetaan päivitetty sensori tietokantaan
    const updatedSensor = await this.sensorRepository.save(sensor);

    return plainToInstance(Sensor, updatedSensor); // Palautetaan päivitetty sensori ilman käyttäjän tietoja
  }

  // Lisätään sensoridataa
  async addSensorData(sensorId: number, temperature: number, humidity: number): Promise<SensorData> {
    const sensor = await this.sensorRepository.findOne({ where: { id: sensorId } });
    if (!sensor) {
      throw new Error('Sensor not found');
    }

    const sensorData = this.sensorDataRepository.create({
      sensor,
      temperature,
      humidity,
      timestamp: new Date(),
    });

    return await this.sensorDataRepository.save(sensorData);
  }

async getSensorData(sensorId: number): Promise<SensorData[]> {
    // Käytetään leftJoinAndSelect, jotta sensor ja sen käyttäjä ladataan yhdessä
    const sensorData = await this.sensorDataRepository
      .createQueryBuilder('sensorData')
      .leftJoinAndSelect('sensorData.sensor', 'sensor')
      .leftJoinAndSelect('sensor.user', 'user') // Liitetään myös käyttäjä
      .where('sensorData.sensorId = :sensorId', { sensorId })
      .orderBy('sensorData.timestamp', 'DESC')
      .getMany();

    // Poistetaan salasana käyttäjiltä
    sensorData.forEach((data) => {
      if (data.sensor && data.sensor.user) {
        // Käytetään plainToInstance poistaaksesi salasanan
        data.sensor.user = plainToInstance(User, data.sensor.user); 
      }
    });

    return sensorData;
  }
  async getSensorsByUserId(userId: number): Promise<Sensor[]> {
    return this.sensorRepository.find({
      where: { user: { id: userId } },
    });
  }
}

