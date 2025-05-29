import { IsString, IsEmail, IsOptional, MinLength, IsEnum } from 'class-validator';

export enum UserRole {
  CUSTOMER = 'customer',
  SELLER = 'seller',
  ADMIN = 'admin'
}

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.CUSTOMER;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  firstName?: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
