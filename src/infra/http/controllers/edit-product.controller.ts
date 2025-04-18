import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Param,
  Put,
} from '@nestjs/common'
import { EditProductUseCase } from '@/domain/marketplace/application/use-cases/edit-product'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipe/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { ProductDetailsPresenter } from '../presenters/product-details-presenter'
import { NotAllowedError } from '@/domain/marketplace/application/use-cases/errors/not-allowed-error'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const editProductBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  priceInCents: z.number(),
  categoryId: z.string().uuid(),
  attachmentsIds: z.array(z.string().uuid()),
})

const bodyValidationPipe = new ZodValidationPipe(editProductBodySchema)

type EditProductBodySchema = z.infer<typeof editProductBodySchema>

@Controller('/products/:id')
export class EditProductController {
  constructor(private editProduct: EditProductUseCase) {}

  @Put()
  async handle(
    @Body(bodyValidationPipe) body: EditProductBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') productId: string,
  ) {
    const { title, categoryId, description, priceInCents, attachmentsIds } =
      body
    const userId = user.sub

    const result = await this.editProduct.execute({
      productId,
      ownerId: userId,
      title,
      categoryId,
      description,
      priceInCents,
      attachmentsIds,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case NotAllowedError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return { product: ProductDetailsPresenter.toHTTP(result.value.product) }
  }
}
