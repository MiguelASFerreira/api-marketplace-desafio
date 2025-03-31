import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { CategoriesRepository } from '../repositories/categories-repository'
import { Category } from '../../enterprise/entities/category'

interface CreateCategoryUseCaseRequest {
  title: string
}

type CreateCategoryUseCaseResponse = Either<
  null,
  {
    category: Category
  }
>

@Injectable()
export class CreateCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({
    title,
  }: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
    const category = Category.create({
      title,
    })

    await this.categoriesRepository.create(category)

    return right({
      category,
    })
  }
}
