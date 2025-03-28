import { SellerRepository } from '@/domain/marketplace/application/repositories/seller-repository'
import { Seller } from '@/domain/marketplace/enterprise/entities/seller'

export class InMemorySellersRepository implements SellerRepository {
  public items: Seller[] = []

  async findById(id: string) {
    const seller = this.items.find((item) => item.id.toString() === id)

    if (!seller) {
      return null
    }

    return seller
  }

  async findByEmail(email: string) {
    const seller = this.items.find((item) => item.email === email)

    if (!seller) {
      return null
    }

    return seller
  }

  async findByPhone(phone: string) {
    const seller = this.items.find((item) => item.phone === phone)

    if (!seller) {
      return null
    }

    return seller
  }

  async save(seller: Seller) {
    const itemIndex = this.items.findIndex((item) => item.id === seller.id)

    this.items[itemIndex] = seller
  }

  async create(seller: Seller) {
    this.items.push(seller)
  }
}
