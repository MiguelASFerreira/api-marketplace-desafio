import { Injectable } from '@nestjs/common'
import { SellerRepository } from '../repositories/seller-repository'
import { Either, left, right } from '@/core/either'
import { Seller } from '../../enterprise/entities/seller'
import { HashGenerator } from '../cryptography/hash-generator'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'

interface RegisterSellerUseCaseRequest {
  name: string
  email: string
  phone: string
  password: string
  avatarId: string
}

type RegisterSellerUseCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    seller: Seller
  }
>

@Injectable()
export class RegisterSellerUseCase {
  constructor(
    private sellerRepository: SellerRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    phone,
    password,
    avatarId,
  }: RegisterSellerUseCaseRequest): Promise<RegisterSellerUseCaseResponse> {
    const sellerWithSameEmail = await this.sellerRepository.findByEmail(email)

    if (sellerWithSameEmail) {
      return left(new StudentAlreadyExistsError(email))
    }

    const sellerWithSamePhone = await this.sellerRepository.findByPhone(phone)

    if (sellerWithSamePhone) {
      return left(new StudentAlreadyExistsError(phone))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const seller = Seller.create({
      name,
      email,
      phone,
      password: hashedPassword,
      avatarId,
    })

    await this.sellerRepository.create(seller)

    return right({ seller })
  }
}
