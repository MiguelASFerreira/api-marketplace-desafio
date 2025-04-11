import { Injectable } from '@nestjs/common'
import { SellersRepository } from '../repositories/sellers-repository'
import { Either, left, right } from '@/core/either'
import { Seller } from '../../enterprise/entities/user/seller'
import { HashGenerator } from '../cryptography/hash-generator'
import { EmailAlreadyExistsError } from './errors/email-already-exists-error'
import { InvalidPasswordConfirmationError } from './errors/invalid-password-confirmation-error'
import { PhoneAlreadyExistsError } from './errors/phone-already-exists-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { UserAttachment } from '../../enterprise/entities/user/user-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UserAttachmentList } from '../../enterprise/entities/user/user-attachment-list'

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
    private sellersRepository: SellersRepository,
    private attachmentsRepository: AttachmentsRepository,
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

    const attachment = avatarId
      ? await this.attachmentsRepository.findById(avatarId)
      : null

    if (avatarId && !attachment) {
      return left(new ResourceNotFoundError())
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const seller = Seller.create({
      name,
      email,
      phone,
      password: hashedPassword,
    })

    if (avatarId) {
      const userAttachment = UserAttachment.create({
        attachmentId: new UniqueEntityID(avatarId),
        userId: seller.id,
      })

      seller.avatar = new UserAttachmentList([userAttachment])
    }

    await this.sellersRepository.create(seller)

    return right({ seller })
  }
}
