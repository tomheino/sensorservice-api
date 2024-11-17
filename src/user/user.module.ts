import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';  // Tuodaan controller
import { SensorModule } from '../sensor/sensor.module'; // Tuodaan SensorModule



@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => SensorModule)], // Register the User entity with TypeORM
  controllers: [UserController],  // Lisää controller tänne
  providers: [UserService],
  exports: [UserService], // Export the service if you need to use it in other modules
})
export class UserModule {}

