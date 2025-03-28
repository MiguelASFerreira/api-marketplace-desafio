import { Injectable } from '@nestjs/common'
import { SellerRepository } from '../repositories/seller-repository'
import { Either, left, right } from '@/core/either'
import { Seller } from '../../enterprise/entities/seller'
import { HashGenerator } from '../cryptography/hash-generator'
import { EmailAlreadyExistsError } from './errors/email-already-exists-error'
import { InvalidPasswordConfirmationError } from './errors/invalid-password-confirmation-error'
import { PhoneAlreadyExistsError } from './errors/phone-already-exists-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface RegisterSellerUseCaseRequest {
  name: string
  email: string
  phone: string
  avatarId: string | null
  password: string
  passwordConfirmation: string
}

type RegisterSellerUseCaseResponse = Either<
  | InvalidPasswordConfirmationError
  | EmailAlreadyExistsError
  | PhoneAlreadyExistsError
  | ResourceNotFoundError,
  {
    seller: Seller
  }
>

@Injectable()
export class RegisterSellerUseCase {
  constructor(
    private sellersRepository: SellerRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    phone,
    avatarId,
    password,
    passwordConfirmation,
  }: RegisterSellerUseCaseRequest): Promise<RegisterSellerUseCaseResponse> {
    if (password !== passwordConfirmation) {
      return left(new InvalidPasswordConfirmationError())
    }

    const sellerWithSameEmail = await this.sellersRepository.findByEmail(email)

    if (sellerWithSameEmail) {
      return left(new EmailAlreadyExistsError(email))
    }

    const sellerWithSamePhone = await this.sellersRepository.findByPhone(phone)

    if (sellerWithSamePhone) {
      return left(new PhoneAlreadyExistsError(phone))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const seller = Seller.create({
      name,
      email,
      phone,
      avatarId,
      password: hashedPassword,
    })

    await this.sellersRepository.create(seller)

    return right({ seller })
  }
}
