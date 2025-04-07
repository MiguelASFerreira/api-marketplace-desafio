import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import {
  ProductAttachment,
  ProductAttachmentProps,
} from '@/domain/marketplace/enterprise/entities/product-attachment'

export function makeProductAttachment(
  override: Partial<ProductAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const productAttachment = ProductAttachment.create(
    {
      productId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return productAttachment
}
