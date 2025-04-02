import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Product,
  ProductProps,
} from '@/domain/marketplace/enterprise/entities/product'
import { ProductAttachmentList } from '@/domain/marketplace/enterprise/entities/product-attachment-list'

export function makeProduct(
  override: Partial<ProductProps> = {},
  id?: UniqueEntityID,
) {
  const product = Product.create(
    {
      title: faker.lorem.sentence(),
      description: faker.lorem.text(),
      priceInCents: faker.number.int(10),
      ownerId: new UniqueEntityID(),
      categoryId: new UniqueEntityID(),
      attachments: new ProductAttachmentList(),
      ...override,
    },
    id,
  )

  return product
}
