import { IsString, IsNumber, Min, IsArray, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  quantity: number;

  @IsArray()
  @IsString({ each: true })
  categories: string[];

  @IsString()
  @IsUUID()
  sellerId: string;
}
