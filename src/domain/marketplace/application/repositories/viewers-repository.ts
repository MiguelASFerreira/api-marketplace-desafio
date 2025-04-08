import { Viewer } from '../../enterprise/entities/user/viewer'

export interface ViewersRepository {
  findById(id: string): Promise<Viewer | null>
  create(viewer: Viewer): Promise<void>
}
