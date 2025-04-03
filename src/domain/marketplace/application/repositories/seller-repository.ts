import { Seller } from '../../enterprise/entities/user/seller'

export abstract class SellerRepository {
  abstract findById(id: string): Promise<Seller | null>
  abstract findByEmail(email: string): Promise<Seller | null>
  abstract findByPhone(phone: string): Promise<Seller | null>
  abstract save(seller: Seller): Promise<void>
  abstract create(seller: Seller): Promise<void>
}
