import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import {
  UserAttachment,
  UserAttachmentProps,
} from '@/domain/marketplace/enterprise/entities/user/user-attachment'

export function makeUserAttachment(
  override: Partial<UserAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const userAttachment = UserAttachment.create(
    {
      userId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return userAttachment
}
