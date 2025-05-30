import type { ProductStatus } from '.prisma/client';

export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  status: ProductStatus;
  sellerId: string;
  categories: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaginationOptions {
  page: number;
  limit: number;
  category?: string;
  status?: ProductStatus;
  sellerId?: string;
}

export interface IPaginatedProducts {
  items: IProduct[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}
