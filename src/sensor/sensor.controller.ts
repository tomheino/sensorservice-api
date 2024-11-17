// import { Controller, Post, Body, Param, Get, Delete } from '@nestjs/common';
// import { SensorService } from './sensor.service';
// import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { Sensor } from './entities/sensor.entity';

// @Controller('sensors')
// @ApiTags('sensors')
// export class SensorController {
//   constructor(private readonly sensorService: SensorService) {}

//   // Luo uusi sensori käyttäjälle
//   @Post(':userId')
//   @ApiOperation({ summary: 'Create a new sensor for the user' })
//   @ApiResponse({ status: 201, description: 'Sensor created successfully.' })
//   async createSensor(
//     @Param('userId') userId: number,
//     @Body() createSensorDto: { name: string; location: string; measuredValues: number[] },
//   ): Promise<Sensor> {
//     return await this.sensorService.createSensor(
//       userId,
//       createSensorDto.name,
//       createSensorDto.location,
//       createSensorDto.measuredValues,
//     );
//   }

//   // Hae kaikki sensoreita käyttäjälle
//   @Get(':userId')
//   @ApiOperation({ summary: 'Get all sensors for the user' })
//   @ApiResponse({ status: 200, description: 'List of sensors' })
//   async getSensors(@Param('userId') userId: number): Promise<Sensor[]> {
//     return await this.sensorService.getSensorsByUser(userId);
//   }

//   // Poista sensori
//   @Delete(':sensorId')
//   @ApiOperation({ summary: 'Delete a sensor by ID' })
//   @ApiResponse({ status: 200, description: 'Sensor deleted successfully.' })
//   async deleteSensor(@Param('sensorId') sensorId: number): Promise<void> {
//     return await this.sensorService.deleteSensor(sensorId);
//   }
// }

// // sensors.controller.ts
// import { Controller, Post, Body } from '@nestjs/common';
// import { SensorService } from './sensor.service';
// import { CreateSensorDto } from './dto/create-sensor.dto';
// import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// import { UseGuards } from '@nestjs/common';

// @Controller('sensors')
// @ApiTags('sensors')
// export class SensorController {
//   constructor(private readonly sensorService: SensorService) {}

//   @Post()
//   @ApiOperation({ summary: 'Create a new sensor with measured values' })
// //   @ApiBearerAuth()
// //   @UseGuards(JwtAuthGuard)
//   async createSensor(@Body() createSensorDto: CreateSensorDto) {
//     return await this.sensorService.createSensor(createSensorDto);
//   }
// }

// sensor.controller.ts
import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';

@Controller('sensors')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Post()
  async createSensor(@Body() createSensorDto: CreateSensorDto) {
    return this.sensorService.createSensor(createSensorDto);
  }

  @Post(':id/data')
  async addSensorData(
    @Param('id') sensorId: number,
    @Body() data: { temperature: number; humidity: number },
  ) {
    const { temperature, humidity } = data;
    return this.sensorService.addSensorData(sensorId, temperature, humidity);
  }

  @Get(':id/data')
  async getSensorData(@Param('id') sensorId: number) {
    return this.sensorService.getSensorData(sensorId);
  }

  @Patch(':id')
  async updateSensor(
    @Param('id') id: number,
    @Body() updateSensorDto: UpdateSensorDto,
  ) {
    return this.sensorService.updateSensor(id, updateSensorDto);
  }
}

