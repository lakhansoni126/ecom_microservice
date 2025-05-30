import { ProductStatus } from '.prisma/client';

export const mapGrpcStatus = (status: ProductStatus): number => {
  switch (status) {
    case ProductStatus.ACTIVE:
      return 0;
    case ProductStatus.INACTIVE:
      return 1;
    case ProductStatus.OUT_OF_STOCK:
      return 2;
    default:
      return 0;
  }
};

export const mapDbStatus = (status: number): ProductStatus => {
  switch (status) {
    case 0:
      return ProductStatus.ACTIVE;
    case 1:
      return ProductStatus.INACTIVE;
    case 2:
      return ProductStatus.OUT_OF_STOCK;
    default:
      return ProductStatus.ACTIVE;
  }
};
