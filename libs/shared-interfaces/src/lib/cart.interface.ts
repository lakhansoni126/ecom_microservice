export enum CartStatus {
  ACTIVE = 'active',
  CHECKOUT = 'checkout',
  ABANDONED = 'abandoned'
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  status: CartStatus;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}
