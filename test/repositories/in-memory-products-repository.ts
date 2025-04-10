import {
  ProductsRepository,
  FindMany,
  FindManyByOwner,
  type Count,
} from '@/domain/marketplace/application/repositories/products-repository'
import { Product } from '@/domain/marketplace/enterprise/entities/product'
import { normalizeDate } from 'test/utils/normalizeDate'

export class InMemoryProductsRepository implements ProductsRepository {
  public items: Product[] = []

  async count({ sellerId, status, from }: Count) {
    let filteredProducts = this.items

    const normalizedFrom = from ? normalizeDate(from) : null

    filteredProducts = filteredProducts.filter((product) => {
      const productStatusAt = normalizeDate(product.statusAt)

      return (
        product.ownerId.toString() === sellerId &&
        (!status || product.status.toString() === status) &&
        (!from || productStatusAt >= normalizedFrom!)
      )
    })

    return filteredProducts.length
  }

  async findById(id: string) {
    const product = this.items.find((item) => item.id.toString() === id)

    if (!product) {
      return null
    }

    return product
  }

  async findManyByOwner({ ownerId, search, status }: FindManyByOwner) {
    let filteredProducts = this.items

    filteredProducts = filteredProducts.filter(
      (product) => product.ownerId.toString() === ownerId,
    )

    if (search) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.title.includes(search) ||
          product.description.includes(search),
      )
    }

    if (status) {
      filteredProducts = filteredProducts.filter(
        (product) => product.status === status,
      )
    }

    const products = filteredProducts.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    )

    return products
  }

  async findMany({ page, search, status }: FindMany) {
    let filteredProducts = this.items

    if (search) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.title.includes(search) ||
          product.description.includes(search),
      )
    }

    if (status) {
      filteredProducts = filteredProducts.filter(
        (product) => product.status === status,
      )
    }

    const products = filteredProducts
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return products
  }

  async save(product: Product) {
    const itemIndex = this.items.findIndex((item) => item.id === product.id)

    this.items[itemIndex] = product
  }

  async create(product: Product) {
    this.items.push(product)
  }
}
