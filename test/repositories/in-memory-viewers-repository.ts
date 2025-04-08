import { ViewersRepository } from '@/domain/marketplace/application/repositories/viewers-repository'
import { Viewer } from '@/domain/marketplace/enterprise/entities/user/viewer'

export class InMemoryViewersRepository implements ViewersRepository {
  public items: Viewer[] = []

  async findById(id: string) {
    const viewer = this.items.find((item) => item.id.toString() === id)

    if (!viewer) {
      return null
    }

    return viewer
  }

  async create(viewer: Viewer) {
    this.items.push(viewer)
  }
}
