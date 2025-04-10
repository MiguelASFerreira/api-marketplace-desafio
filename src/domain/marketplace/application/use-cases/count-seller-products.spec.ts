import { CountSellerProductsUseCase } from './count-seller-products'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { makeProduct } from 'test/factories/make-product'
import { InMemorySellersRepository } from 'test/repositories/in-memory-seller-repository'
import { makeSeller } from 'test/factories/make-seller'
import { ProductStatus } from '../../enterprise/entities/product'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryUserAttachmentsRepository } from 'test/repositories/in-memory-user-attachments-repository'

let inMemoryUserAttachmentsRepository: InMemoryUserAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemorySellersRepository: InMemorySellersRepository
let inMemoryProductsRepository: InMemoryProductsRepository
let sut: CountSellerProductsUseCase

describe('Count Seller Products', () => {
  beforeEach(() => {
    inMemoryUserAttachmentsRepository = new InMemoryUserAttachmentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemorySellersRepository = new InMemorySellersRepository(
      inMemoryUserAttachmentsRepository,
      inMemoryAttachmentsRepository,
    )
    inMemoryProductsRepository = new InMemoryProductsRepository()
    sut = new CountSellerProductsUseCase(
      inMemorySellersRepository,
      inMemoryProductsRepository,
    )
  })

  it('should be able to count the number of products sold by the seller in the last 30 days', async () => {
    const seller = makeSeller()
    await inMemorySellersRepository.create(seller)

    for (let i = 1; i <= 50; i++) {
      const fakerStatusAt = new Date()
      fakerStatusAt.setDate(fakerStatusAt.getDate() - i)

      const product = makeProduct({
        ownerId: seller.id,
        status: i % 2 === 0 ? ProductStatus.SOLD : ProductStatus.AVAILABLE,
        statusAt: fakerStatusAt,
      })

      await inMemoryProductsRepository.create(product)
    }

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const result = await sut.execute({
      sellerId: seller.id.toValue(),
      status: ProductStatus.SOLD,
      from: thirtyDaysAgo,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      amount: 15,
    })
  })

  it('should be able to count the amount of available products in the last 30 days', async () => {
    const seller = makeSeller()
    await inMemorySellersRepository.create(seller)

    for (let i = 1; i <= 50; i++) {
      const fakerStatusAt = new Date()
      fakerStatusAt.setDate(fakerStatusAt.getDate() - i)

      const product = makeProduct({
        ownerId: seller.id,
        status: i % 2 === 0 ? ProductStatus.SOLD : ProductStatus.AVAILABLE,
        statusAt: fakerStatusAt,
      })

      await inMemoryProductsRepository.create(product)
    }

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const result = await sut.execute({
      sellerId: seller.id.toValue(),
      status: ProductStatus.AVAILABLE,
      from: thirtyDaysAgo,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      amount: 15,
    })
  })

  it('should not be able to count products of a non-existent seller', async () => {
    const product = makeProduct()
    await inMemoryProductsRepository.create(product)

    const result = await sut.execute({
      sellerId: 'seller-1',
      status: ProductStatus.SOLD,
      from: new Date(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
