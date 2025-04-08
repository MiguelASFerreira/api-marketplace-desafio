import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { makeProduct } from 'test/factories/make-product'
import { FetchProductsByOwnerIdUseCase } from './fetch-products-by-owner'
import { ProductStatus } from '../../enterprise/entities/product'
import { InMemorySellersRepository } from 'test/repositories/in-memory-seller-repository'
import { makeSeller } from 'test/factories/make-seller'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryUserAttachmentsRepository } from 'test/repositories/in-memory-user-attachments-repository'

let inMemoryUserAttachmentsRepository: InMemoryUserAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemorySellersRepository: InMemorySellersRepository
let inMemoryProductsRepository: InMemoryProductsRepository
let sut: FetchProductsByOwnerIdUseCase

describe('Fetch Products by Owner', () => {
  beforeEach(() => {
    inMemoryUserAttachmentsRepository = new InMemoryUserAttachmentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemorySellersRepository = new InMemorySellersRepository(
      inMemoryUserAttachmentsRepository,
      inMemoryAttachmentsRepository,
    )
    inMemoryProductsRepository = new InMemoryProductsRepository()
    sut = new FetchProductsByOwnerIdUseCase(
      inMemorySellersRepository,
      inMemoryProductsRepository,
    )
  })

  it('should be able to fetch all seller products', async () => {
    const seller1 = makeSeller()
    await inMemorySellersRepository.create(seller1)

    const seller2 = makeSeller()
    await inMemorySellersRepository.create(seller2)

    await inMemoryProductsRepository.create(
      makeProduct({
        ownerId: seller1.id,
        createdAt: new Date(2024, 11, 20),
      }),
    )
    await inMemoryProductsRepository.create(
      makeProduct({
        ownerId: seller2.id,
        createdAt: new Date(2024, 11, 18),
      }),
    )
    await inMemoryProductsRepository.create(
      makeProduct({
        ownerId: seller1.id,
        createdAt: new Date(2024, 11, 23),
      }),
    )

    const result = await sut.execute({
      ownerId: seller1.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.products).toEqual([
      expect.objectContaining({
        ownerId: seller1.id,
        createdAt: new Date(2024, 11, 23),
      }),
      expect.objectContaining({
        ownerId: seller1.id,
        createdAt: new Date(2024, 11, 20),
      }),
    ])
  })

  it('should be able to fetch filtered seller products by title or description', async () => {
    const seller1 = makeSeller()
    await inMemorySellersRepository.create(seller1)

    await inMemoryProductsRepository.create(
      makeProduct({
        ownerId: seller1.id,
        title: 'Produto 1',
        description: 'Descrição 123',
        createdAt: new Date(2024, 11, 20),
      }),
    )
    await inMemoryProductsRepository.create(
      makeProduct({
        ownerId: seller1.id,
        title: 'Produto 2',
        description: 'Descrição 456',
        createdAt: new Date(2024, 11, 18),
      }),
    )
    await inMemoryProductsRepository.create(
      makeProduct({
        ownerId: seller1.id,
        title: 'Produto 3',
        description: 'Descrição 789',
        createdAt: new Date(2024, 11, 23),
      }),
    )

    const seller2 = makeSeller()
    await inMemorySellersRepository.create(seller2)

    for (let i = 1; i <= 10; i++) {
      await inMemoryProductsRepository.create(
        makeProduct({ ownerId: seller2.id }),
      )
    }

    const result = await sut.execute({
      ownerId: seller1.id.toString(),
      search: '2',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.products).toEqual([
      expect.objectContaining({
        description: 'Descrição 123',
      }),
      expect.objectContaining({
        title: 'Produto 2',
      }),
    ])
  })

  it('should be able to fetch filtered seller products by status', async () => {
    const seller1 = makeSeller()
    await inMemorySellersRepository.create(seller1)

    await inMemoryProductsRepository.create(
      makeProduct({
        ownerId: seller1.id,
        status: ProductStatus.AVAILABLE,
        createdAt: new Date(2024, 11, 20),
      }),
    )
    await inMemoryProductsRepository.create(
      makeProduct({
        ownerId: seller1.id,
        status: ProductStatus.SOLD,
        createdAt: new Date(2024, 11, 18),
      }),
    )
    await inMemoryProductsRepository.create(
      makeProduct({
        ownerId: seller1.id,
        status: ProductStatus.AVAILABLE,
        createdAt: new Date(2024, 11, 23),
      }),
    )

    const seller2 = makeSeller()
    await inMemorySellersRepository.create(seller2)

    for (let i = 1; i <= 10; i++) {
      await inMemoryProductsRepository.create(
        makeProduct({ ownerId: seller2.id }),
      )
    }

    const result = await sut.execute({
      ownerId: seller1.id.toString(),
      status: ProductStatus.AVAILABLE,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.products).toEqual([
      expect.objectContaining({
        ownerId: seller1.id,
        status: ProductStatus.AVAILABLE,
        createdAt: new Date(2024, 11, 23),
      }),
      expect.objectContaining({
        ownerId: seller1.id,
        status: ProductStatus.AVAILABLE,
        createdAt: new Date(2024, 11, 20),
      }),
    ])
  })

  it('should be able to fetch filtered seller products by title or description and status', async () => {
    const seller1 = makeSeller()
    await inMemorySellersRepository.create(seller1)

    await inMemoryProductsRepository.create(
      makeProduct({
        ownerId: seller1.id,
        title: 'Produto 1',
        description: 'Descrição 123',
        status: ProductStatus.AVAILABLE,
        createdAt: new Date(2024, 11, 20),
      }),
    )
    await inMemoryProductsRepository.create(
      makeProduct({
        ownerId: seller1.id,
        title: 'Produto 2',
        description: 'Descrição 456',
        status: ProductStatus.SOLD,
        createdAt: new Date(2024, 11, 18),
      }),
    )
    await inMemoryProductsRepository.create(
      makeProduct({
        ownerId: seller1.id,
        title: 'Produto 3',
        description: 'Descrição 789',
        status: ProductStatus.CANCELLED,
        createdAt: new Date(2024, 11, 23),
      }),
    )

    const seller2 = makeSeller()
    await inMemorySellersRepository.create(seller2)

    for (let i = 1; i <= 10; i++) {
      await inMemoryProductsRepository.create(
        makeProduct({ ownerId: seller2.id }),
      )
    }

    const result = await sut.execute({
      ownerId: seller1.id.toString(),
      search: '2',
      status: ProductStatus.AVAILABLE,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.products).toEqual([
      expect.objectContaining({
        title: 'Produto 1',
      }),
    ])
  })
})
