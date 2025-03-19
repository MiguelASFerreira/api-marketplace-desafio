import { Injectable } from '@nestjs/common'
import { UserRepository } from '../repositories/user-repository'
import { Either, left, right } from '@/core/either'
import { User } from '../../enterprise/entities/user'
import { HashGenerator } from '../cryptography/hash-generator'

interface RegisterUserUseCaseRequest {
  name: string
  email: string
  phone: string
  password: string
  avatarId: string
}

type RegisterUserUseCaseResponse = Either<
  Error,
  {
    user: User
  }
>

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    phone,
    password,
    avatarId,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const userWithSameEmail = await this.userRepository.findByEmail(email)

    if (userWithSameEmail) {
      return left(new Error())
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const user = User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      avatarId,
    })

    await this.userRepository.create(user)

    return right({ user })
  }
}
