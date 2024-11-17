import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async createUser(email: string, password: string): Promise<User> {
    const user = this.userRepository.create({ email, password });
    return this.userRepository.save(user);
  }
  async insertUser(createUserDto: CreateUserDto): Promise<User> {
    // Tarkistetaan, onko käyttäjä jo olemassa sähköpostin perusteella
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
  
    if (existingUser) {
      // Jos käyttäjä löytyy, heitetään virhe
      throw new ConflictException('Käyttäjä on jo olemassa annetulla sähköpostiosoitteella');
    }
  
    // Jos käyttäjää ei ole, luodaan uusi
    const user = new User();
    user.email = createUserDto.email;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.password = createUserDto.password;  // Tallennetaan salasana
  
    // Tallennetaan käyttäjä tietokantaan
    const savedUser = await this.userRepository.save(user);
  
    // Palautetaan tallennettu käyttäjä ilman salasanaa
    return plainToInstance(User, savedUser);
  }
async findUserByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne({where: {email: username}});
}
async findUserById(id: string): Promise<User> {
    return await this.userRepository.findOneBy({id: parseInt(id)});
}
async getUsers(): Promise<User []> {
    return await this.userRepository.find({relations: ["sensors"]});
}
async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // Etsitään käyttäjä tietokannasta
    const user = await this.userRepository.findOne({ where: { id } });
  
    if (!user) {
      throw new Error('User not found');
    }
  
    // Tarkistetaan, onko uusi sähköposti jo käytössä
    if (updateUserDto.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
  
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Käyttäjätunnus on jo olemassa');
    }
  
      // Päivitetään sähköposti, jos se on annettu
      user.email = updateUserDto.email;
    }
  
    // Päivitetään muut käyttäjän tiedot
    if (updateUserDto.password) user.password = updateUserDto.password;
    if (updateUserDto.firstName) user.firstName = updateUserDto.firstName;
    if (updateUserDto.lastName) user.lastName = updateUserDto.lastName;
  
    // Tallennetaan päivitetty käyttäjä tietokantaan
    const updatedUser = await this.userRepository.save(user);
  
    // Palautetaan päivitetty käyttäjä ilman salasanaa
    return plainToInstance(User, updatedUser);
  }
  
async deleteUserById(id: string): Promise<void> {
    const user = await this.userRepository.findOneBy({id: parseInt(id)});
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    console.log(`deleting ${JSON.stringify(user)} and related sensors`);
      await this.userRepository.remove(user);
    }
}
