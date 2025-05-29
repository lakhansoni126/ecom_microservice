import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole } from '../enums/user-role.enum';

export class RegisterDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  first_name: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  last_name: string;

  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
