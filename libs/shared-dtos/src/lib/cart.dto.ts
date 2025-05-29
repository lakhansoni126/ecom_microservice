import { IsString, IsNumber, IsPositive, IsArray, IsUUID, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum CartStatus {
  ACTIVE = 'active',
  CHECKOUT = 'checkout',
  ABANDONED = 'abandoned'
}

export class CartItemDto {
  @IsUUID()
  productId!: string;

  @IsNumber()
  @IsPositive()
  quantity!: number;
}

export class CreateCartDto {
  @IsUUID()
  userId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items!: CartItemDto[];

  @IsEnum(CartStatus)
  status: CartStatus = CartStatus.ACTIVE;
}

export class UpdateCartDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items!: CartItemDto[];

  @IsEnum(CartStatus)
  status!: CartStatus;
}
