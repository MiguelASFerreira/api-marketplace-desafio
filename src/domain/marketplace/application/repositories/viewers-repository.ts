import { Viewer } from '../../enterprise/entities/user/viewer'

export abstract class ViewersRepository {
  abstract findById(id: string): Promise<Viewer | null>
  abstract create(viewer: Viewer): Promise<void>
}
