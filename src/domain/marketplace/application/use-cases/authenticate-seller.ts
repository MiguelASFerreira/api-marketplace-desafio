import { Injectable } from '@nestjs/common'
import { SellersRepository } from '../repositories/sellers-repository'
import { Either, left, right } from '@/core/either'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { HashComparer } from '../cryptography/hash-comparer'
import { Encrypter } from '../cryptography/encrypter'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

type AuthenticateUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateUseCase {
  constructor(
    private sellersRepository: SellersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const seller = await this.sellersRepository.findByEmail(email)

    if (!seller) {
      return left(new WrongCredentialsError())
    }

    const isSamePassword = await this.hashComparer.compare(
      password,
      seller.password,
    )

    if (!isSamePassword) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: seller.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
