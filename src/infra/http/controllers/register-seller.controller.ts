import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { RegisterSellerUseCase } from '@/domain/marketplace/application/use-cases/register-seller'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipe/zod-validation-pipe'
import { EmailAlreadyExistsError } from '@/domain/marketplace/application/use-cases/errors/email-already-exists-error'
import { PhoneAlreadyExistsError } from '@/domain/marketplace/application/use-cases/errors/phone-already-exists-error'
import { UserWithAvatarPresenter } from '../presenters/user-with-avatar-presenter'
import { Public } from '@/infra/auth/public'

const resgisterSellerBodySchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string().email(),
  password: z.string(),
  avatarId: z.string().uuid().nullable(),
  passwordConfirmation: z.string(),
})

type ResgisterSellerBodySchema = z.infer<typeof resgisterSellerBodySchema>

@Controller('/sellers')
@Public()
export class RegisterSellerController {
  constructor(private registerSeller: RegisterSellerUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(resgisterSellerBodySchema))
  async handle(@Body() body: ResgisterSellerBodySchema) {
    const { name, phone, email, password, avatarId, passwordConfirmation } =
      body

    const result = await this.registerSeller.execute({
      name,
      phone,
      email,
      password,
      avatarId,
      passwordConfirmation,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case EmailAlreadyExistsError:
          throw new ConflictException(error.message)
        case PhoneAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const seller = result.value.seller

    return {
      seller: UserWithAvatarPresenter.toHTTP(seller),
    }
  }
}
