import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ProductsRepository } from '../repositories/products-repository'
import { Product, ProductStatus } from '../../enterprise/entities/product'
import { SellerRepository } from '../repositories/seller-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'
import { CategoriesRepository } from '../repositories/categories-repository'

interface EditProductUseCaseRequest {
  ownerId: string
  productId: string
  title: string
  description: string
  priceInCents: number
  categoryId: string
}

type EditProductUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    product: Product
  }
>

@Injectable()
export class EditProductUseCase {
  constructor(
    private sellersRepository: SellerRepository,
    private categoriesRepository: CategoriesRepository,
    private productsRepository: ProductsRepository,
  ) {}

  async execute({
    ownerId,
    productId,
    title,
    description,
    priceInCents,
    categoryId,
  }: EditProductUseCaseRequest): Promise<EditProductUseCaseResponse> {
    const seller = await this.sellersRepository.findById(ownerId)

    if (!seller) {
      return left(new ResourceNotFoundError())
    }

    const product = await this.productsRepository.findById(productId)

    if (!product) {
      return left(new ResourceNotFoundError())
    }

    if (seller.id.toString() !== product.ownerId.toString()) {
      return left(new NotAllowedError())
    }

    if (product.status === ProductStatus.SOLD) {
      return left(new NotAllowedError())
    }

    const category = await this.categoriesRepository.findById(categoryId)

    if (!category) {
      return left(new ResourceNotFoundError())
    }

    product.title = title
    product.description = description
    product.priceInCents = priceInCents
    product.categoryId = category.id

    await this.productsRepository.save(product)

    return right({
      product,
    })
  }
}
