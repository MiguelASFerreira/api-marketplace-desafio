import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Product } from '../../enterprise/entities/product'
import { Injectable } from '@nestjs/common'
import { SellersRepository } from '../repositories/sellers-repository'
import { ProductsRepository } from '../repositories/products-repository'

interface CountSellerProductsUseCaseRequest {
  sellerId: string
  status?: Product['status']
  from?: Date
}

type CountSellerProductsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    amount: number
  }
>

@Injectable()
export class CountSellerProductsUseCase {
  constructor(
    private sellersRepository: SellersRepository,
    private productsRepository: ProductsRepository,
  ) {}

  async execute({
    sellerId,
    status,
    from,
  }: CountSellerProductsUseCaseRequest): Promise<CountSellerProductsUseCaseResponse> {
    const seller = await this.sellersRepository.findById(sellerId)

    if (!seller) {
      return left(new ResourceNotFoundError())
    }

    const amount = await this.productsRepository.count({
      sellerId,
      status,
      from,
    })

    return right({
      amount,
    })
  }
}
