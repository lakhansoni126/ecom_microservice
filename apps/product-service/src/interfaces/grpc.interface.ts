export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  quantity: number;
  categories: string[];
  seller_id: string;
}

export interface UpdateProductRequest {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  categories?: string[];
  status?: number;
}

export interface ListProductsRequest {
  page: number;
  limit: number;
  category?: string;
  status?: number;
  seller_id?: string;
}

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  categories: string[];
  status: number;
  seller_id: string;
  created_at: string;
  updated_at: string;
}

export interface ListProductsResponse {
  products: ProductResponse[];
  total: number;
  has_next: boolean;
}

export interface DeleteProductResponse {
  success: boolean;
}

export interface IGrpcService {
  CreateProduct(request: CreateProductRequest): Promise<ProductResponse>;
  UpdateProduct(request: UpdateProductRequest): Promise<ProductResponse>;
  GetProduct(request: { id: string }): Promise<ProductResponse>;
  ListProducts(request: ListProductsRequest): Promise<ListProductsResponse>;
  DeleteProduct(request: { id: string }): Promise<DeleteProductResponse>;
}
