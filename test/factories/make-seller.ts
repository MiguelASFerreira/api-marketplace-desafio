import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Seller,
  SellerProps,
} from '@/domain/marketplace/enterprise/entities/user/seller'
import { UserAttachmentList } from '@/domain/marketplace/enterprise/entities/user/user-attachment-list'

export function makeSeller(
  override: Partial<SellerProps> = {},
  id?: UniqueEntityID,
) {
  const seller = Seller.create(
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

  return seller
}
