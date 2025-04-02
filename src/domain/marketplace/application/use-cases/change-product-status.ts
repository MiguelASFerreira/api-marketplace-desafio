import { Injectable } from '@nestjs/common'
import { SellerRepository } from '../repositories/seller-repository'
import { ProductsRepository } from '../repositories/products-repository'
import { Either, left, right } from '@/core/either'
import { Product, ProductStatus } from '../../enterprise/entities/product'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface ChangeProductStatusUseCaseRequest {
  productId: string
  ownerId: string
  newStatus: ProductStatus
}

type ChangeProductStatusUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    product: Product
  }
>

@Injectable()
export class ChangeProductStatusUseCase {
  constructor(
    private sellersRepository: SellerRepository,
    private productRepository: ProductsRepository,
  ) {}

  async execute({
    ownerId,
    newStatus,
    productId,
  }: ChangeProductStatusUseCaseRequest): Promise<ChangeProductStatusUseCaseResponse> {
    const seller = await this.sellersRepository.findById(ownerId)

    if (!seller) {
      return left(new ResourceNotFoundError())
    }

    const product = await this.productRepository.findById(productId)

    if (!product) {
      return left(new ResourceNotFoundError())
    }

    if (seller.id !== product.ownerId) {
      return left(new NotAllowedError())
    }

    if (
      product.status === ProductStatus.SOLD &&
      newStatus === ProductStatus.CANCELLED
    ) {
      return left(new NotAllowedError())
    }

    if (
      product.status === ProductStatus.CANCELLED &&
      newStatus === ProductStatus.SOLD
    ) {
      return left(new NotAllowedError())
    }

    product.status = newStatus

    await this.productRepository.save(product)

    return right({
      product,
    })
  }
}
