import { Product } from '../../enterprise/entities/product'
import { PaginationParams } from '@/core/repositories/pagination-params'

export interface FindManyByOwner {
  ownerId: string
  search?: string
  status?: Product['status']
}

export interface FindMany extends PaginationParams {
  search?: string
  status?: Product['status']
}
export abstract class ProductsRepository {
  abstract findById(productId: string): Promise<Product | null>
  abstract findManyByOwner(params: FindManyByOwner): Promise<Product[]>
  abstract findMany(params: FindMany): Promise<Product[]>
  abstract save(product: Product): Promise<void>
  abstract create(product: Product): Promise<void>
}
