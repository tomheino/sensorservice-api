import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'; // Lisää tarvittavat validointiominaisuudet

export class UpdateUserDto {
  @ApiProperty({ required: false }) // `required: false` tekee kentästä valinnaisen Swagger-dokumentaatiossa
  @IsOptional() // Kenttä on valinnainen
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString() // Varmistaa, että kenttä on merkkijono
  password?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastName?: string;
}
