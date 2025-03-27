import { Injectable } from '@nestjs/common'
import { UserRepository } from '../../repositories/user-repository'
import { Either, left, right } from '@/core/either'
import { User } from '../../../enterprise/entities/user'
import { HashGenerator } from '../../cryptography/hash-generator'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

interface EditUserUseCaseRequest {
  userId: string
  name: string
  email: string
  phone: string
  password: string
  avatarId: string
}

type EditUserUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    user: User
  }
>

@Injectable()
export class EditUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    userId,
    name,
    email,
    phone,
    password,
    avatarId,
  }: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    if (userId !== user.id.toString()) {
      return left(new NotAllowedError())
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    user.name = name
    user.email = email
    user.password = hashedPassword
    user.phone = phone
    user.avatarId = avatarId

    await this.userRepository.save(user)

    return right({ user })
  }
}
