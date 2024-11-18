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
import { Controller, Post, Body, Get, Param, Patch, NotFoundException, Inject } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { Sensor } from './entities/sensor.entity';
import { EmailService } from '../email/email.service'; // importoi EmailService
import { UserService } from '../user/user.service'; // Tuodaan UserService



@Controller('sensors')
export class SensorController {
  constructor(private readonly sensorService: SensorService,
    @Inject(EmailService) private emailService: EmailService,
    @Inject(UserService) private userService: UserService, // Injektoi UserService
  ) {}

  @Post()
  async createSensor(@Body() createSensorDto: CreateSensorDto) {
    return this.sensorService.createSensor(createSensorDto);
  }

  // @Post(':id/data')
  // async addSensorData(
  //   @Param('id') sensorId: number,
  //   @Body() data: { temperature: number; humidity: number },
  // ) {
  //   const { temperature, humidity } = data;
    
  //   // Tulostetaan sensorin ID ja vastaanotettu data
  //   console.log(`Sensor ID: ${sensorId}, Data: ${JSON.stringify(data)}`);
  
  //   // Lisää data tietokantaan tai muuhun käsittelyyn
  //   return this.sensorService.addSensorData(sensorId, temperature, humidity);
  // }
  
    // GET-pyyntö sensorin datan hakemiseksi id:n perusteella
    @Get(':id/data')
    async getSensorData(@Param('id') sensorId: number) {
      // Haetaan sensorin dataa
      const sensorData = await this.sensorService.getSensorData(sensorId);
  
      if (!sensorData || sensorData.length === 0) {
        throw new Error(`No data found for sensor with ID: ${sensorId}`);
      }
  
      return sensorData; // Palautetaan sensorin mittaustiedot
    }

  // @Post(':id/data')
  // async addSensorData(
  //   @Param('id') sensorId: string,
  //   @Body() data: { temperature: number; humidity: number },
  //   @Body('sensorName') sensorName: string,
  //   @Body('sensorLocation') sensorLocation: string,
  // ) {
  //   const { temperature, humidity } = data;

  //   // Haetaan käyttäjä tietokannasta käyttäen sensorin ID:tä
  //   const user = await this.userService.findUserById(sensorId); // Hakee käyttäjän tiedot
  //   if (!user) {
  //     console.log(`Käyttäjää ei löytynyt sensorin ID:llä: ${sensorId}`);
  //     return; // Jos käyttäjää ei löydy, lopetetaan
  //   }
    
  //   const userEmail = user.email; // Haetaan sähköpostiosoite käyttäjän tiedoista

  //   // Lämpötilan tarkistus
  //   if (temperature < 18 || temperature > 20) {
  //     const subject = `Sensor Alert: ${sensorId}, ${sensorName}`;
  //     const text = `Sensor ${sensorId} ${sensorName} ${sensorLocation} alert. Lämpötila on ylittänyt sallitun rajan: ${temperature}`;
  //     await this.emailService.sendEmail(userEmail, subject, text); // Lähetetään sähköposti oikealle käyttäjälle
  //   }

  //   // Kosteuden tarkistus
  //   if (humidity < 25 || humidity > 60) {
  //     const subject = `Sensor Alert: ${sensorId}, ${sensorName}`;
  //     const text = `Sensor ${sensorId} ${sensorName} ${sensorLocation} alert. Kosteus on ylittänyt sallitun rajan: ${humidity}`;
  //     await this.emailService.sendEmail(userEmail, subject, text); // Lähetetään sähköposti oikealle käyttäjälle
  //   }

  //   console.log(`updateSensorData: ${JSON.stringify(data)}`);
  //   return this.sensorService.addSensorData(parseInt(sensorId), temperature, humidity);
  // }
  
  @Post(':id/data')
  async addSensorData(
    @Param('id') sensorId: string,
    @Body() data: { temperature: number; humidity: number; sensorName: string; sensorLocation: string },
  ) {
    const { temperature, humidity, sensorName, sensorLocation } = data;

    // Haetaan käyttäjä tietokannasta sensorin ID:n avulla
    const user = await this.userService.findUserById(sensorId);
    if (!user) {
      console.log(`Käyttäjää ei löytynyt sensorin ID:llä: ${sensorId}`);
      return; // Jos käyttäjää ei löydy, lopetetaan
    }
    
    const userEmail = user.email; // Haetaan sähköpostiosoite käyttäjän tiedoista

    // Lämpötilan tarkistus (18-30 astetta)
    if (temperature < 18 || temperature > 20) {
      const subject = `Sensor Alert: ${sensorId}, ${sensorName}`;
      const text = `Sensor ${sensorId} ${sensorName} ${sensorLocation} alert. Lämpötila on ylittänyt sallitun rajan: ${temperature}`;
      await this.emailService.sendEmail(userEmail, subject, text); // Lähetetään sähköposti käyttäjälle
    }

    // Kosteuden tarkistus (25%-60%)
    if (humidity < 25 || humidity > 60) {
      const subject = `Sensor Alert: ${sensorId}, ${sensorName}`;
      const text = `Sensor ${sensorId} ${sensorName} ${sensorLocation} alert. Kosteus on ylittänyt sallitun rajan: ${humidity}`;
      await this.emailService.sendEmail(userEmail, subject, text); // Lähetetään sähköposti käyttäjälle
    }

    console.log(`Sensor data: ${JSON.stringify(data)}`);
    return this.sensorService.addSensorData(parseInt(sensorId), temperature, humidity);
  }

  @Patch(':id')
  async updateSensor(
    @Param('id') id: number,
    @Body() updateSensorDto: UpdateSensorDto,
  ) {
    return this.sensorService.updateSensor(id, updateSensorDto);
  }
}

