import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Viewer,
  ViewerProps,
} from '@/domain/marketplace/enterprise/entities/user/viewer'
import { UserAttachmentList } from '@/domain/marketplace/enterprise/entities/user/user-attachment-list'

export function makeViewer(
  override: Partial<ViewerProps> = {},
  id?: UniqueEntityID,
) {
  const viewer = Viewer.create(
    {
      name: faker.person.fullName(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      avatar: new UserAttachmentList(),
      ...override,
    },
    id,
  )

  return viewer
}
