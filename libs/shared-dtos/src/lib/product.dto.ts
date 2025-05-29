import { IsString, IsNumber, IsPositive, IsArray, IsOptional, MinLength, IsEnum } from 'class-validator';

export enum ProductStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued'
}

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  name!: string;

  @IsString()
  @MinLength(10)
  description!: string;

  @IsNumber()
  @IsPositive()
  price!: number;

  @IsNumber()
  @IsPositive()
  quantity!: number;

  @IsArray()
  @IsString({ each: true })
  categories!: string[];

  @IsEnum(ProductStatus)
  @IsOptional()
  status: ProductStatus = ProductStatus.DRAFT;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  name?: string;

  @IsString()
  @IsOptional()
  @MinLength(10)
  description?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  quantity?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categories?: string[];

  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;
}
