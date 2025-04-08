import { View } from '../../enterprise/entities/view'

export interface ViewsRepository {
  findById(id: string): Promise<View | null>
  isViewed(view: View): Promise<boolean>
  create(view: View): Promise<View>
}
