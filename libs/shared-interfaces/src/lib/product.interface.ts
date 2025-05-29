export enum ProductStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  categories: string[];
  status: ProductStatus;
  sellerId: string;
  createdAt: Date;
  updatedAt: Date;
}
