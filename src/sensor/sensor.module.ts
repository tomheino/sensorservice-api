// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { SensorService } from './sensor.service';
// import { Sensor } from './entities/sensor.entity';
// import { SensorController } from './sensor.controller';
// import { User } from 'src/user/entities/user.entity';
// import { UserModule } from 'src/user/user.module';

// @Module({
//   imports: [TypeOrmModule.forFeature([Sensor, User]), UserModule],  // Varmista, että sensori ja käyttäjä ovat mukana
//   controllers: [SensorController],
//   providers: [SensorService],
// })
// export class SensorModule {}

// sensor.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorService } from './sensor.service';
import { SensorController } from './sensor.controller';
import { Sensor } from './entities/sensor.entity';
import { SensorData } from './entities/sensor-data.entity';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { EmailService } from 'src/email/email.service';  // Import the EmailModule


@Module({
  imports: [TypeOrmModule.forFeature([Sensor, SensorData, User]), forwardRef(() => UserModule)],
  controllers: [SensorController],
  providers: [SensorService, EmailService],
  exports: [SensorService, TypeOrmModule], 
})
export class SensorModule {}
