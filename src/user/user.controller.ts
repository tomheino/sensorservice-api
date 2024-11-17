// import { Controller } from '@nestjs/common';

// @Controller('user')
// export class UserController {}

import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { SensorService } from 'src/sensor/sensor.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@ApiTags('users')
export class UserController {
    constructor(private readonly userService: UserService,
    private readonly sensorService: SensorService)
    {}
    

    @Post()
    @ApiOperation({summary: 'Create a new User'})
    // @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        console.log(`createUser: ${JSON.stringify(createUserDto)}`)
        return await this.userService.insertUser(createUserDto);
    }

    @Get()
    @ApiOperation({summary: 'Get all Users'})
    @ApiResponse({status: 200, description: 'OK'})
    async getUsers(): Promise<User []> {
        return await this.userService.getUsers();
    }

    @Get(':id')
    @ApiOperation({summary: 'Get User by ID'})
    @ApiResponse({status: 200, description: 'OK'})
    @ApiResponse({status: 404, description: 'Matching id not found'})
    async getUserById(@Param('id') id: string) {
        return await this.userService.findUserById(id);
    }

    @Patch(':id')
    @ApiBearerAuth()    
    @ApiOperation({summary: 'Update User'})
    @ApiResponse({status: 200, description: 'OK'})
    @ApiResponse({status: 404, description: 'Matching id not found'})
    // @UseGuards(JwtAuthGuard)
    async updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        console.log(`updateUser: ${JSON.stringify(updateUserDto)}`)

      return this.userService.updateUser(id, updateUserDto);
    }

    @Delete(':id')
    @ApiOperation({summary: 'Delete User by ID'})
    @ApiResponse({status: 200, description: 'OK'})
    @ApiResponse({status: 404, description: 'Matching id not found'})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
        console.log(`deleteUser ID: ${JSON.stringify(id)}`)
        await this.userService.deleteUserById(id);
        return { message: 'User deleted successfully' };
    }

    @Get(':id/sensors')
    async getUserSensors(@Param('id') userId: string) {
      const user = await this.userService.findUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }
  
      // Hakee käyttäjän sensoreiden tiedot
      const sensors = await this.sensorService.getSensorsByUserId(user.id);
      
      return sensors;
    }
}
