import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ProductsRepository } from '../repositories/products-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Product } from '../../enterprise/entities/product'
import { SellerRepository } from '../repositories/seller-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface CreateProductUseCaseRequest {
  title: string
  description: string
  priceInCents: number
  ownerId: string
  categoryId: string
}

type CreateProductUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    product: Product
  }
>

@Injectable()
export class CreateProductUseCase {
  constructor(
    private sellersRepository: SellerRepository,
    private productsRepository: ProductsRepository,
  ) {}

  async execute({
    title,
    description,
    priceInCents,
    ownerId,
    categoryId,
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    const seller = await this.sellersRepository.findById(ownerId)

    if (!seller) {
      return left(new ResourceNotFoundError())
    }

    const product = Product.create({
      title,
      description,
      priceInCents,
      ownerId: new UniqueEntityID(ownerId),
      categoryId: new UniqueEntityID(categoryId),
    })

    await this.productsRepository.create(product)

    return right({
      product,
    })
  }
}
