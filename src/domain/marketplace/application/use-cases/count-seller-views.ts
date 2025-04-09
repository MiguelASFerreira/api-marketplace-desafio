import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import type { SellerRepository } from '../repositories/seller-repository'
import type { ViewsRepository } from '../repositories/views-repository'

interface CountSellerViewsUseCaseRequest {
  sellerId: string
  from?: Date
}

type CountSellerViewsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    amount: number
  }
>

@Injectable()
export class CountSellerViewsUseCase {
  constructor(
    private sellersRepository: SellerRepository,
    private viewsRepository: ViewsRepository,
  ) {}

  async execute({
    sellerId,
    from,
  }: CountSellerViewsUseCaseRequest): Promise<CountSellerViewsUseCaseResponse> {
    const seller = await this.sellersRepository.findById(sellerId)

    if (!seller) {
      return left(new ResourceNotFoundError())
    }

    const amount = await this.viewsRepository.count({
      sellerId,
      from,
    })

    return right({
      amount,
    })
  }
}
