import { Injectable } from '@nestjs/common'
import { SellerRepository } from '../repositories/seller-repository'
import { Either, left, right } from '@/core/either'
import { Seller } from '../../enterprise/entities/seller'
import { HashGenerator } from '../cryptography/hash-generator'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

interface EditSellerUseCaseRequest {
  sellerId: string
  name: string
  email: string
  phone: string
  password: string
  avatarId: string
}

type EditSellerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    seller: Seller
  }
>

@Injectable()
export class EditSellerUseCase {
  constructor(
    private sellerRepository: SellerRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    sellerId,
    name,
    email,
    phone,
    password,
    avatarId,
  }: EditSellerUseCaseRequest): Promise<EditSellerUseCaseResponse> {
    const seller = await this.sellerRepository.findById(sellerId)

    if (!seller) {
      return left(new ResourceNotFoundError())
    }

    if (sellerId !== seller.id.toString()) {
      return left(new NotAllowedError())
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    seller.name = name
    seller.email = email
    seller.password = hashedPassword
    seller.phone = phone
    seller.avatarId = avatarId

    await this.sellerRepository.save(seller)

    return right({ seller })
  }
}
