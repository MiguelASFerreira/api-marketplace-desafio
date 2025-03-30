import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export enum ProductStatus {
  AVAILABLE = 'available',
  SOLD = 'sold',
  CANCELLED = 'cancelled',
}

export interface ProductProps {
  title: string
  description: string
  priceInCents: number
  status: ProductStatus
  ownerId: UniqueEntityID
  categoryId: UniqueEntityID
  createdAt: Date
}

export class Product extends Entity<ProductProps> {
  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
  }

  get description() {
    return this.props.description
  }

  set description(description: string) {
    this.props.description = description
  }

  get priceInCents() {
    return this.props.priceInCents
  }

  set priceInCents(priceInCents: number) {
    this.props.priceInCents = priceInCents
  }

  get status() {
    return this.props.status
  }

  set status(status: ProductStatus) {
    this.props.status = status
  }

  get ownerId() {
    return this.props.ownerId
  }

  get categoryId() {
    return this.props.categoryId
  }

  set categoryId(categoryId: UniqueEntityID) {
    this.props.categoryId = categoryId
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<ProductProps, 'status' | 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const product = new Product(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        status: props.status ?? ProductStatus.AVAILABLE,
      },
      id,
    )

    return product
  }
}
