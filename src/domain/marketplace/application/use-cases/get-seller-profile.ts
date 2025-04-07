import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UserWithAvatar } from '../../enterprise/entities/value-objects/user-with-avatar'
import { SellerRepository } from '../repositories/seller-repository'

interface GetSellerProfileUseCaseRequest {
  id: string
}

type GetSellerProfileUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    seller: UserWithAvatar
  }
>

@Injectable()
export class GetSellerProfileUseCase {
  constructor(private sellersRepository: SellerRepository) {}

  async execute({
    id,
  }: GetSellerProfileUseCaseRequest): Promise<GetSellerProfileUseCaseResponse> {
    const seller = await this.sellersRepository.findWithAvatarById(id)

    if (!seller) {
      return left(new ResourceNotFoundError())
    }

    return right({
      seller,
    })
  }
}
