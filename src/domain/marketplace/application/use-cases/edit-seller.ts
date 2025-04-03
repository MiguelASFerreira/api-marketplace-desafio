/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common'
import { SellerRepository } from '../repositories/seller-repository'
import { Either, left, right } from '@/core/either'
import { Seller } from '../../enterprise/entities/user/seller'
import { HashGenerator } from '../cryptography/hash-generator'
import { HashComparer } from '../cryptography/hash-comparer'
import { EmailAlreadyExistsError } from './errors/email-already-exists-error'
import { PhoneAlreadyExistsError } from './errors/phone-already-exists-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { InvalidNewPasswordError } from './errors/invalid-new-password-error'

interface EditSellerUseCaseRequest {
  sellerId: string
  name: string
  email: string
  phone: string
  avatarId?: string | null
  password?: string
  newPassword?: string
}

type EditSellerUseCaseResponse = Either<
  | EmailAlreadyExistsError
  | PhoneAlreadyExistsError
  | ResourceNotFoundError
  | InvalidNewPasswordError
  | WrongCredentialsError,
  {
    seller: Seller
  }
>

@Injectable()
export class EditSellerUseCase {
  constructor(
    private sellersRepository: SellerRepository,
    private hashGenerator: HashGenerator,
    private hashComparer: HashComparer,
  ) {}

  async execute({
    sellerId,
    name,
    email,
    phone,
    avatarId = null,
    password,
    newPassword,
  }: EditSellerUseCaseRequest): Promise<EditSellerUseCaseResponse> {
    const seller = await this.sellersRepository.findById(sellerId)

    if (!seller) {
      return left(new ResourceNotFoundError())
    }

    const sellerWithSameEmail = await this.sellersRepository.findByEmail(email)

    if (sellerWithSameEmail) {
      if (sellerWithSameEmail.id.toString() !== sellerId) {
        return left(new EmailAlreadyExistsError(email))
      }
    }
    const sellerWithSamePhone = await this.sellersRepository.findByPhone(phone)

    if (sellerWithSamePhone) {
      if (sellerWithSamePhone.id.toString() !== sellerId) {
        return left(new PhoneAlreadyExistsError(phone))
      }
    }

    if (newPassword) {
      if (!password) {
        return left(new WrongCredentialsError())
      }

      if (newPassword === password) {
        return left(new InvalidNewPasswordError())
      }

      const isPasswordValid = await this.hashComparer.compare(
        password,
        seller.password,
      )

      if (!isPasswordValid) {
        return left(new WrongCredentialsError())
      }

      const hashedNewPassword = await this.hashGenerator.hash(newPassword)

      seller.password = hashedNewPassword
    }

    seller.name = name
    seller.phone = phone
    seller.email = email

    await this.sellersRepository.save(seller)

    return right({ seller })
  }
}
