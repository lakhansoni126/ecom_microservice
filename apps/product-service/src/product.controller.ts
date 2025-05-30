import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProductService } from './product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { mapGrpcStatus, mapDbStatus } from './utils/status.mapper';
import {
  CreateProductRequest,
  UpdateProductRequest,
  ListProductsRequest,
  ProductResponse,
  ListProductsResponse,
  DeleteProductResponse
} from './interfaces/grpc.interface';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @GrpcMethod('ProductService')
  async CreateProduct(request: CreateProductRequest): Promise<ProductResponse> {
    const product = await this.productService.create({
      name: request.name,
      description: request.description,
      price: request.price,
      quantity: request.quantity,
      categories: request.categories,
      sellerId: request.seller_id,
    });

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      categories: product.categories,
      status: mapGrpcStatus(product.status),
      seller_id: product.sellerId,
      created_at: product.createdAt.toISOString(),
      updated_at: product.updatedAt.toISOString(),
    };
  }

  @GrpcMethod('ProductService')
  async UpdateProduct(request: UpdateProductRequest): Promise<ProductResponse> {
    const product = await this.productService.update({
      id: request.id,
      ...(request.name !== undefined && { name: request.name }),
      ...(request.description !== undefined && { description: request.description }),
      ...(request.price !== undefined && { price: request.price }),
      ...(request.quantity !== undefined && { quantity: request.quantity }),
      ...(request.categories && { categories: request.categories }),      ...(request.status !== undefined && { status: mapDbStatus(request.status) }),
    });

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      categories: product.categories,
      status: mapGrpcStatus(product.status),
      seller_id: product.sellerId,
      created_at: product.createdAt.toISOString(),
      updated_at: product.updatedAt.toISOString(),
    };
  }

  @GrpcMethod('ProductService')
  async GetProduct(request: { id: string }): Promise<ProductResponse> {
    const product = await this.productService.findById(request.id);
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      categories: product.categories,
      status: mapGrpcStatus(product.status),
      seller_id: product.sellerId,
      created_at: product.createdAt.toISOString(),
      updated_at: product.updatedAt.toISOString(),
    };
  }

  @GrpcMethod('ProductService')
  async ListProducts(request: ListProductsRequest): Promise<ListProductsResponse> {
    const result = await this.productService.findAll({      page: request.page,
      limit: request.limit,
      category: request.category,
      status: request.status !== undefined ? mapDbStatus(request.status) : undefined,
      sellerId: request.seller_id,
    });

    return {
      products: result.items.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        categories: product.categories,
        status: mapGrpcStatus(product.status),
        seller_id: product.sellerId,
        created_at: product.createdAt.toISOString(),
        updated_at: product.updatedAt.toISOString(),
      })),
      total: result.total,
      has_next: result.hasNext,
    };
  }

  @GrpcMethod('ProductService')
  async DeleteProduct(request: { id: string }): Promise<DeleteProductResponse> {
    await this.productService.delete(request.id);
    return { success: true };
  }
}
