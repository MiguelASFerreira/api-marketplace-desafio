import { View } from '../../enterprise/entities/view'

export interface Count {
  sellerId: string
  productId?: string
  from?: Date
}

export abstract class ViewsRepository {
  abstract count(params: Count): Promise<number>
  abstract findById(id: string): Promise<View | null>
  abstract isViewed(view: View): Promise<boolean>
  abstract create(view: View): Promise<View>
}
