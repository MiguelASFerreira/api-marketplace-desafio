import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ProductsRepository } from '../repositories/products-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Product } from '../../enterprise/entities/product'
import { SellersRepository } from '../repositories/sellers-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { CategoriesRepository } from '../repositories/categories-repository'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { ProductAttachmentList } from '../../enterprise/entities/product-attachment-list'
import { ProductAttachment } from '../../enterprise/entities/product-attachment'

interface CreateProductUseCaseRequest {
  title: string
  description: string
  priceInCents: number
  ownerId: string
  categoryId: string
  attachmentsIds: string[]
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
    private sellersRepository: SellersRepository,
    private productsRepository: ProductsRepository,
    private categoriesRepository: CategoriesRepository,
    private attachmentsRepository: AttachmentsRepository,
  ) {}

  async execute({
    title,
    description,
    priceInCents,
    ownerId,
    categoryId,
    attachmentsIds,
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    const seller = await this.sellersRepository.findById(ownerId)

    if (!seller) {
      return left(new ResourceNotFoundError())
    }

    const category = await this.categoriesRepository.findById(categoryId)

    if (!category) {
      return left(new ResourceNotFoundError())
    }

    const attachments =
      await this.attachmentsRepository.findManyByIds(attachmentsIds)

    if (!attachments.hasAll) {
      return left(new ResourceNotFoundError())
    }

    const product = Product.create({
      title,
      description,
      priceInCents,
      ownerId: new UniqueEntityID(ownerId),
      categoryId: new UniqueEntityID(categoryId),
      attachments: new ProductAttachmentList(),
    })

    const productAttachments = attachmentsIds.map((attachmentId) => {
      return ProductAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        productId: product.id,
      })
    })

    product.attachments = new ProductAttachmentList(productAttachments)

    await this.productsRepository.create(product)

    return right({
      product,
    })
  }
}
