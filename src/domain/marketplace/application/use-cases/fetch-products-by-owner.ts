import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Product } from '../../enterprise/entities/product'
import { SellerRepository } from '../repositories/seller-repository'
import { ProductsRepository } from '../repositories/products-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface FetchProductsByOwnerIdUseCaseRequest {
  ownerId: string
  search?: string
  status?: Product['status']
}

type FetchProductsByOwnerIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    products: Product[]
  }
>

@Injectable()
export class FetchProductsByOwnerIdUseCase {
  constructor(
    private sellersRepository: SellerRepository,
    private productsRepository: ProductsRepository,
  ) {}

  async execute({
    ownerId,
    search,
    status,
  }: FetchProductsByOwnerIdUseCaseRequest): Promise<FetchProductsByOwnerIdUseCaseResponse> {
    const seller = await this.sellersRepository.findById(ownerId)

    if (!seller) {
      return left(new ResourceNotFoundError())
    }

    const products = await this.productsRepository.findManyByOwner({
      ownerId,
      search,
      status,
    })

    return right({
      products,
    })
  }
}
