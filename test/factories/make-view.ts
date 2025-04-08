import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { View, ViewProps } from '@/domain/marketplace/enterprise/entities/view'
import { makeProduct } from './make-product'
import { makeViewer } from './make-viewer'

export function makeView(
  override: Partial<ViewProps> = {},
  id?: UniqueEntityID,
) {
  const view = View.create(
    {
      product: makeProduct(),
      viewer: makeViewer(),
      ...override,
    },
    id,
  )

  return view
}
