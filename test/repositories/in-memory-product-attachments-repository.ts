import { ProductAttachmentsRepository } from '@/domain/marketplace/application/repositories/product-attachments-repository'
import { ProductAttachment } from '@/domain/marketplace/enterprise/entities/product-attachment'

export class InMemoryProductAttachmentsRepository
  implements ProductAttachmentsRepository
{
  public items: ProductAttachment[] = []

  async findManyByProductId(productId: string) {
    const productAttachments = this.items.filter(
      (item) => item.productId.toString() === productId,
    )

    return productAttachments
  }

  async createMany(attachments: ProductAttachment[]) {
    this.items.push(...attachments)
  }
}
