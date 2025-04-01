import {
  ProductsRepository,
  FindMany,
} from '@/domain/marketplace/application/repositories/products-repository'
import { Product } from '@/domain/marketplace/enterprise/entities/product'

export class InMemoryProductsRepository implements ProductsRepository {
  public items: Product[] = []

  async findById(id: string) {
    const product = this.items.find((item) => item.id.toString() === id)

    if (!product) {
      return null
    }

    return product
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
