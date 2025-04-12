import { Injectable } from '@nestjs/common'
import { ProductsRepository } from '../repositories/products-repository'
import { Either, right } from '@/core/either'
import { Product } from '../../enterprise/entities/product'
import { ProductDetails } from '../../enterprise/entities/value-objects/product-details'

interface FetchAllProductsUseCaseRequest {
  page: number
  search?: string
  status?: Product['status']
}

type FetchAllProductsUseCaseResponse = Either<
  null,
  {
    products: ProductDetails[]
  }
>

@Injectable()
export class FetchAllProductsUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    page,
    search,
    status,
  }: FetchAllProductsUseCaseRequest): Promise<FetchAllProductsUseCaseResponse> {
    const products = await this.productsRepository.findManyWithDetails({
      page,
      search,
      status,
    })

    return right({
      products,
    })
  }
}
