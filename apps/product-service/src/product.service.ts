import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { IProduct, IPaginationOptions, IPaginatedProducts } from './interfaces/product.interface';
import type { ProductStatus, Prisma } from '.prisma/client';
import { Logger } from 'winston';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  async create(data: CreateProductDto): Promise<IProduct> {
    try {
      this.logger.info('Creating new product', { name: data.name });

      const product = await this.prisma.product.create({
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          quantity: data.quantity,
          sellerId: data.sellerId,
          categories: {
            connectOrCreate: data.categories.map(name => ({
              where: { name },
              create: { name }
            }))
          }
        },
        include: {
          categories: true
        }
      });

      return {
        ...product,
        categories: product.categories.map(c => c.name)
      };
    } catch (error) {
      this.logger.error('Failed to create product', { error, name: data.name });
      throw error;
    }
  }

  async update(data: UpdateProductDto): Promise<IProduct> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id: data.id },
        include: { categories: true }
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${data.id} not found`);
      }

      const updatedProduct = await this.prisma.product.update({
        where: { id: data.id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.description && { description: data.description }),
          ...(data.price && { price: data.price }),
          ...(data.quantity && { quantity: data.quantity }),
          ...(data.status && { status: data.status }),
          ...(data.categories && {
            categories: {
              set: [],
              connectOrCreate: data.categories.map(name => ({
                where: { name },
                create: { name }
              }))
            }
          })
        },
        include: {
          categories: true
        }
      });

      return {
        ...updatedProduct,
        categories: updatedProduct.categories.map(c => c.name)
      };
    } catch (error) {
      this.logger.error('Failed to update product', { error, id: data.id });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id }
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      await this.prisma.product.delete({
        where: { id }
      });
    } catch (error) {
      this.logger.error('Failed to delete product', { error, id });
      throw error;
    }
  }

  async findById(id: string): Promise<IProduct> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        categories: true
      }
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return {
      ...product,
      categories: product.categories.map(c => c.name)
    };
  }

  async findAll(options: IPaginationOptions): Promise<IPaginatedProducts> {
    const { page = 1, limit = 10, category, status, sellerId } = options;
    const skip = (page - 1) * limit;

    const where = {
      ...(status && { status }),
      ...(sellerId && { sellerId }),
      ...(category && {
        categories: {
          some: {
            name: category
          }
        }
      })
    };

    const [total, items] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          categories: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    ]);

    const hasNext = skip + items.length < total;

    return {
      items: items.map(product => ({
        ...product,
        categories: product.categories.map(c => c.name)
      })),
      total,
      page,
      limit,
      hasNext
    };
  }
}
