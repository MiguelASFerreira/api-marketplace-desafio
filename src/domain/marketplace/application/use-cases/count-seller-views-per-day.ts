import { Either, left, right } from '@/core/either'
import { ViewsPerDay, ViewsRepository } from '../repositories/views-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { SellersRepository } from '../repositories/sellers-repository'

interface CountSellerViewsPerDayUseCaseRequest {
  sellerId: string
  from?: Date
}

type CountSellerViewsPerDayUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    viewsPerDay: ViewsPerDay[]
  }
>

@Injectable()
export class CountSellerViewsPerDayUseCase {
  constructor(
    private sellersRepository: SellersRepository,
    private viewsRepository: ViewsRepository,
  ) {}

  async execute({
    sellerId,
    from,
  }: CountSellerViewsPerDayUseCaseRequest): Promise<CountSellerViewsPerDayUseCaseResponse> {
    const seller = await this.sellersRepository.findById(sellerId)

    if (!seller) {
      return left(new ResourceNotFoundError())
    }

    const viewsPerDay = await this.viewsRepository.countPerDay({
      sellerId,
      from,
    })

    return right({
      viewsPerDay,
    })
  }
}
