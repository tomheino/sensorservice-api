import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user/user.service';
import { CreateUserDto } from './user/dto/create-user.dto';
import { User } from './user/entities/user.entity';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express'; // Import express module

const swaggerInfo = {
  api_path: `/docs`,
  title: `Sensor service API`,
  description: `Service API for Sensors API.`,
  version: `0.9`,
  tag: ``
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true }); // Enable CORS

  const config = new DocumentBuilder()
    .setTitle(swaggerInfo.title)
    .setDescription(swaggerInfo.description)
    .setVersion(swaggerInfo.version)
    .addTag(swaggerInfo.tag)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerInfo.api_path, app, document);

  const userService = app.get(UserService);

  // Get all users
  const allUsers = await userService.getUsers();

  // If users don't exist, create the admin user
  if (!allUsers || allUsers.length === 0) {
    const admin: CreateUserDto = {
      email: 'admin@sensorservices.com',
      firstName: 'Admin',
      lastName: 'User',
      password: 'admin',
    };

    const adminUser: User = await userService.insertUser(admin);
    console.log('Admin user created successfully:', adminUser);
  }

  await app.listen(3000);
}
bootstrap();

