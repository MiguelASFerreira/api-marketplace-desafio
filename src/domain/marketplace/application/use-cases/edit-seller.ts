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
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { UserAttachmentsRepository } from '../repositories/user-attachments-repository'
import { UserAttachmentList } from '../../enterprise/entities/user/user-attachment-list'
import { UserAttachment } from '../../enterprise/entities/user/user-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface EditSellerUseCaseRequest {
  sellerId: string
  name: string
  email: string
  phone: string
  avatarId?: string
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
    private attachmentsRepository: AttachmentsRepository,
    private userAttachmentsRepository: UserAttachmentsRepository,
    private hashGenerator: HashGenerator,
    private hashComparer: HashComparer,
  ) {}

  async execute({
    sellerId,
    name,
    email,
    phone,
    avatarId,
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

    if (avatarId) {
      const avatar = await this.attachmentsRepository.findById(avatarId)

      if (!avatar) {
        return left(new ResourceNotFoundError())
      }

      const currentSellerAvatar =
        await this.userAttachmentsRepository.findByUserId(sellerId)

      const userAttachmentList = currentSellerAvatar
        ? new UserAttachmentList([currentSellerAvatar])
        : new UserAttachmentList()

      const sellerAvatar = UserAttachment.create({
        attachmentId: new UniqueEntityID(avatarId),
        userId: seller.id,
      })

      userAttachmentList.update([sellerAvatar])

      seller.avatar = userAttachmentList
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
