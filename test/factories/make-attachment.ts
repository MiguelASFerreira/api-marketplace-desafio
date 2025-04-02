import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Attachment,
  AttachmentProps,
} from '@/domain/marketplace/enterprise/entities/attachment'

export function makeAttachment(
  override: Partial<AttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const attachment = Attachment.create(
    {
      path: faker.internet.url(),
      ...override,
    },
    id,
  )

  return attachment
}
