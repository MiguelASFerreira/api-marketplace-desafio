import {
  ViewsRepository,
  Count,
} from '@/domain/marketplace/application/repositories/views-repository'
import { View } from '@/domain/marketplace/enterprise/entities/view'

export class InMemoryViewsRepository implements ViewsRepository {
  public items: View[] = []

  async count({ sellerId, productId, from }: Count) {
    let filteredViews = this.items

    filteredViews = filteredViews.filter((view) => {
      return (
        (!productId || view.product.id.toString() === productId) &&
        (!from || view.createdAt >= from) &&
        view.product.ownerId.toString() === sellerId
      )
    })

    return filteredViews.length
  }

  async findById(id: string) {
    const view = this.items.find((item) => item.id.toString() === id)

    if (!view) {
      return null
    }

    return view
  }

  async isViewed({
    viewer: { id: viewerId },
    product: { id: productId },
  }: View): Promise<boolean> {
    return this.items.some(
      (item) =>
        item.product.id.toString() === productId.toString() &&
        item.viewer.id.toString() === viewerId.toString(),
    )
  }

  async create(view: View) {
    this.items.push(view)

    return view
  }
}
