import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SensorModule } from './sensor/sensor.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from './email/email.service';


@Module({
  imports: [TypeOrmModule.forRoot({
    "type": "sqlite",
    "database": "database/sensorService.sq3",
    "entities": ["dist/**/**/*.entity{.ts,.js}"],
    "synchronize": true
  }), UserModule, SensorModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}
