import { CreateProductUseCase } from './create-product'
import { InMemorySellersRepository } from 'test/repositories/in-memory-sellers-repository'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { makeSeller } from 'test/factories/make-seller'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { makeCategory } from 'test/factories/make-category'
import { makeAttachment } from 'test/factories/make-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InMemoryUserAttachmentsRepository } from 'test/repositories/in-memory-user-attachments-repository'
import { InMemoryProductAttachmentsRepository } from 'test/repositories/in-memory-product-attachments-repository'

let inMemoryUserAttachmentsRepository: InMemoryUserAttachmentsRepository
let inMemoryProductAttachmentsRepository: InMemoryProductAttachmentsRepository
let inMemorySellersRepository: InMemorySellersRepository
let inMemoryProductsRepository: InMemoryProductsRepository
let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let sut: CreateProductUseCase

describe('Create Product', () => {
  beforeEach(() => {
    inMemoryUserAttachmentsRepository = new InMemoryUserAttachmentsRepository()
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemorySellersRepository = new InMemorySellersRepository(
      inMemoryUserAttachmentsRepository,
      inMemoryAttachmentsRepository,
    )
    inMemoryProductAttachmentsRepository =
      new InMemoryProductAttachmentsRepository()
    inMemoryProductsRepository = new InMemoryProductsRepository(
      inMemoryProductAttachmentsRepository,
      inMemoryUserAttachmentsRepository,
      inMemorySellersRepository,
      inMemoryCategoriesRepository,
      inMemoryAttachmentsRepository,
    )

    sut = new CreateProductUseCase(
      inMemorySellersRepository,
      inMemoryProductsRepository,
      inMemoryCategoriesRepository,
      inMemoryAttachmentsRepository,
    )
  })

  it('should be able to create a product', async () => {
    const seller = makeSeller()

    await inMemorySellersRepository.create(seller)

    const category = makeCategory()

    await inMemoryCategoriesRepository.create(category)

    await inMemoryAttachmentsRepository.createMany([
      makeAttachment({}, new UniqueEntityID('1')),
      makeAttachment({}, new UniqueEntityID('2')),
    ])

    const result = await sut.execute({
      title: 'Novo produto',
      description: 'Descrição do produto',
      priceInCents: 1000,
      ownerId: seller.id.toString(),
      categoryId: category.id.toString(),
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      product: expect.objectContaining({
        title: 'Novo produto',
        owner: expect.objectContaining({
          userId: seller.id,
          avatar: null,
        }),
        category: expect.objectContaining({
          id: category.id,
        }),
        attachments: [
          expect.objectContaining({
            id: new UniqueEntityID('1'),
          }),
          expect.objectContaining({
            id: new UniqueEntityID('2'),
          }),
        ],
      }),
    })
  })

  it('should not be able to create a product with a non-existent user', async () => {
    const category = makeCategory()

    await inMemoryCategoriesRepository.create(category)

    const result = await sut.execute({
      title: 'Novo produto',
      description: 'Descrição do produto',
      priceInCents: 1000,
      ownerId: 'non-existent-user',
      categoryId: category.id.toValue(),
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to create a product with a non-existent category', async () => {
    const seller = makeSeller()

    await inMemorySellersRepository.create(seller)

    const result = await sut.execute({
      title: 'Novo produto',
      description: 'Descrição do produto',
      priceInCents: 1000,
      ownerId: seller.id.toValue(),
      categoryId: 'non-existent-category',
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
