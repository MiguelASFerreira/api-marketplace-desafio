import { AuthenticateUseCase } from '@/domain/marketplace/application/use-cases/authenticate-seller'
import { Public } from '@/infra/auth/public'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipe/zod-validation-pipe'
import { Response } from 'express'
import { WrongCredentialsError } from '@/domain/marketplace/application/use-cases/errors/wrong-credentials-error'

const authenticateSellerBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateSellerBodySchema = z.infer<typeof authenticateSellerBodySchema>

@Controller('/sellers/sessions')
@Public()
export class AuthenticateSellerController {
  constructor(private authenticate: AuthenticateUseCase) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authenticateSellerBodySchema))
  async handle(
    @Body() body: AuthenticateSellerBodySchema,
    @Res() response: Response,
  ) {
    const { email, password } = body

    const result = await this.authenticate.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    })

    return response.json({
      accessToken,
    })
  }
}
