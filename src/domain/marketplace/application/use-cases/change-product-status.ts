import { Injectable } from '@nestjs/common'
import { SellersRepository } from '../repositories/sellers-repository'
import { ProductsRepository } from '../repositories/products-repository'
import { Either, left, right } from '@/core/either'
import { ProductStatus } from '../../enterprise/entities/product'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'
import { ProductDetails } from '../../enterprise/entities/value-objects/product-details'

interface ChangeProductStatusUseCaseRequest {
  productId: string
  ownerId: string
  newStatus: ProductStatus
}

type ChangeProductStatusUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    product: ProductDetails
  }
>

@Injectable()
export class ChangeProductStatusUseCase {
  constructor(
    private sellersRepository: SellersRepository,
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

    if (seller.id.toString() !== product.ownerId.toString()) {
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

    const productWithDetails = await this.productRepository.save(product)

    return right({
      product: productWithDetails,
    })
  }
}
