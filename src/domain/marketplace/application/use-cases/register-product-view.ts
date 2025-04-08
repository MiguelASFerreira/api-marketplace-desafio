import { Either, left, right } from '@/core/either'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { View } from '../../enterprise/entities/view'
import { Injectable } from '@nestjs/common'
import { ProductsRepository } from '../repositories/products-repository'
import { ViewersRepository } from '../repositories/viewers-repository'
import { ViewsRepository } from '../repositories/views-repository'

interface RegisterProductViewUseCaseRequest {
  productId: string
  viewerId: string
}

type RegisterProductViewUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    view: View
  }
>

@Injectable()
export class RegisterProductViewUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private viewersRepository: ViewersRepository,
    private viewsRepository: ViewsRepository,
  ) {}

  async execute({
    productId,
    viewerId,
  }: RegisterProductViewUseCaseRequest): Promise<RegisterProductViewUseCaseResponse> {
    const viewer = await this.viewersRepository.findById(viewerId)

    if (!viewer) {
      return left(new ResourceNotFoundError())
    }

    const product = await this.productsRepository.findById(productId)

    if (!product) {
      return left(new ResourceNotFoundError())
    }

    if (viewerId === product.ownerId.toString()) {
      return left(new NotAllowedError())
    }

    const view = View.create({
      product,
      viewer,
    })

    const isViewed = await this.viewsRepository.isViewed(view)

    if (isViewed) {
      return left(new NotAllowedError())
    }

    await this.viewsRepository.create(view)

    return right({
      view,
    })
  }
}
