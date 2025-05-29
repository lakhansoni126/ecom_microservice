import { IsString, IsNumber, IsPositive, IsArray, IsUUID, ValidateNested, IsEnum, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export class OrderItemDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  price: number;
}

export class CreateOrderDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  cartId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsString()
  shippingAddress: string;

  @IsNumber()
  @IsPositive()
  total: number;
}

export class UpdateOrderDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsString()
  trackingNumber?: string;

  @IsDate()
  @Type(() => Date)
  shippedAt?: Date;

  @IsDate()
  @Type(() => Date)
  deliveredAt?: Date;
}
