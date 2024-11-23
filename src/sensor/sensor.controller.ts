
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

  @Get(':id')
  async getSensorById(@Param('id') sensorId: number) {
    // Haetaan sensori tietokannasta ID:n perusteella
    const sensor = await this.sensorService.getSensorById(sensorId);

    if (!sensor) {
      throw new Error(`Sensor with ID ${sensorId} not found`);
    }

    return sensor; // Palautetaan sensorin tiedot, mukaan lukien käyttäjän tiedot
  }
  
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
//   @Param('id') sensorId: number,
//   @Body() data: { temperature: number; humidity: number },
// ) {
//   const { temperature, humidity } = data;

//   // Haetaan sensorin tiedot, mukaan lukien käyttäjän sähköpostiosoite
//   const sensor = await this.sensorService.getSensorById(sensorId);

//   if (!sensor) {
//     console.log(`Sensoria ei löytynyt ID:llä: ${sensorId}`);
//     return { error: `Sensor with ID ${sensorId} not found` };
//   }

//   const user = sensor.user;
//   if (!user) {
//     console.log(`Käyttäjää ei löytynyt sensorille ID:llä: ${sensorId}`);
//     return { error: `No user found for sensor with ID ${sensorId}` };
//   }

//   const userEmail = user.email;
//   const sensorName = sensor.name;
//   const sensorLocation = sensor.location;

//   // Lämpötilan tarkistus
//   if (temperature < 18 || temperature > 20) {
//     const subject = `Sensor Alert: ${sensorName}`;
//     const text = `Sensor ${sensorName} at ${sensorLocation} alert. Temperature out of range: ${temperature}°C`;
//     await this.emailService.sendEmail(userEmail, subject, text);
//   }

//   // Kosteuden tarkistus
//   if (humidity < 25 || humidity > 60) {
//     const subject = `Sensor Alert: ${sensorName}`;
//     const text = `Sensor ${sensorName} at ${sensorLocation} alert. Humidity out of range: ${humidity}%`;
//     await this.emailService.sendEmail(userEmail, subject, text);
//   }

//   console.log(`Lisätään data sensorille ID: ${sensorId}: ${JSON.stringify(data)}`);
//   return this.sensorService.addSensorData(sensorId, temperature, humidity);
// }

@Post(':id/data')
async addSensorData(
  @Param('id') sensorId: number,
  @Body() data: { temperature: number; humidity: number },
) {
  const { temperature, humidity } = data;

  // Haetaan sensorin tiedot
  const sensor = await this.sensorService.getSensorById(sensorId);

  if (!sensor) {
    console.log(`Sensoria ei löytynyt ID:llä: ${sensorId}`);
    return { error: `Sensor with ID ${sensorId} not found` };
  }

  // Haetaan käyttäjä
  const user = sensor.user;
  if (!user) {
    console.log(`Käyttäjää ei löytynyt sensorille ID:llä: ${sensorId}`);
    return { error: `No user found for sensor with ID ${sensorId}` };
  }

  const userEmail = user.email;
  const sensorName = sensor.name;
  const sensorLocation = sensor.location;

  // Lämpötila-alertin tarkistus
  let temperatureAlert = false;
  if (temperature < sensor.temperatureRange[0] || temperature > sensor.temperatureRange[1]) {
    temperatureAlert = true;

    // Lähetetään hälytys vain, jos alertti ei ole jo aktiivinen
    if (!sensor.temperatureAlert) {
      const subject = `Sensor Alert: ${sensorName}`;
      const text = `Sensor ${sensorName} at ${sensorLocation} alert. Temperature out of range: ${temperature}°C`;
      await this.emailService.sendEmail(userEmail, subject, text);
    }
  }

  // Kosteus-alertin tarkistus
  let humidityAlert = false;
  if (humidity < sensor.humidityRange[0] || humidity > sensor.humidityRange[1]) {
    humidityAlert = true;

    // Lähetetään hälytys vain, jos alertti ei ole jo aktiivinen
    if (!sensor.humidityAlert) {
      const subject = `Sensor Alert: ${sensorName}`;
      const text = `Sensor ${sensorName} at ${sensorLocation} alert. Humidity out of range: ${humidity}%`;
      await this.emailService.sendEmail(userEmail, subject, text);
    }
  }

  // Päivitetään alert-status tietokantaan vain, jos se on muuttunut
  if (
    sensor.temperatureAlert !== temperatureAlert ||
    sensor.humidityAlert !== humidityAlert
  ) {
    sensor.temperatureAlert = temperatureAlert;
    sensor.humidityAlert = humidityAlert;
    await this.sensorService.updateSensorData(sensorId, {
      temperatureAlert,
      humidityAlert,
    });
  }

  // Lisää uusi mittaustieto tietokantaan
  console.log(`Lisätään data sensorille ID: ${sensorId}: ${JSON.stringify(data)}`);
  return this.sensorService.addSensorData(sensorId, temperature, humidity);
}


@Get(':id/data/weekly')
async getWeeklyData(@Param('id') sensorId: number) {
  const now = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(now.getDate() - 7);

  return this.sensorService.getSensorDataWithinRange(sensorId, oneWeekAgo, now);
}







  @Patch(':id')
  async updateSensor(
    @Param('id') id: number,
    @Body() updateSensorDto: UpdateSensorDto,
  ) {
    return this.sensorService.updateSensor(id, updateSensorDto);
  }
}

