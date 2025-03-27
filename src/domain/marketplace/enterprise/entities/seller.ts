import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface SellerProps {
  name: string
  email: string
  phone: string
  password: string
  avatarId: string
}

export class Seller extends Entity<SellerProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get phone() {
    return this.props.phone
  }

  get password() {
    return this.props.password
  }

  get avatarId() {
    return this.props.avatarId
  }

  set name(name: string) {
    this.props.name = name
  }

  set email(email: string) {
    this.props.email = email
  }

  set phone(phone: string) {
    this.props.phone = phone
  }

  set password(password: string) {
    this.props.password = password
  }

  set avatarId(avatarId: string) {
    this.props.avatarId = avatarId
  }

  static create(props: SellerProps, id?: UniqueEntityID) {
    const seller = new Seller(props, id)

    return seller
  }
}
