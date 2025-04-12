import { CountSellerViewsUseCase } from './count-seller-views'
import { InMemoryViewsRepository } from 'test/repositories/in-memory-views-repository'
import { makeView } from 'test/factories/make-view'
import { InMemorySellersRepository } from 'test/repositories/in-memory-sellers-repository'
import { makeSeller } from 'test/factories/make-seller'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryUserAttachmentsRepository } from 'test/repositories/in-memory-user-attachments-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let inMemoryUserAttachmentsRepository: InMemoryUserAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemorySellersRepository: InMemorySellersRepository
let inMemoryViewsRepository: InMemoryViewsRepository
let sut: CountSellerViewsUseCase

describe('Count Seller Views', () => {
  beforeEach(() => {
    inMemoryUserAttachmentsRepository = new InMemoryUserAttachmentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemorySellersRepository = new InMemorySellersRepository(
      inMemoryUserAttachmentsRepository,
      inMemoryAttachmentsRepository,
    )
    inMemoryViewsRepository = new InMemoryViewsRepository()
    sut = new CountSellerViewsUseCase(
      inMemorySellersRepository,
      inMemoryViewsRepository,
    )
  })

  it('should be able to count the views received by the seller in the last 30 days', async () => {
    const baseView = makeView()

    const seller = makeSeller({}, baseView.product.ownerId)
    await inMemorySellersRepository.create(seller)

    for (let i = 1; i <= 50; i++) {
      const fakerCreatedAt = new Date()
      fakerCreatedAt.setDate(fakerCreatedAt.getDate() - i * 2)

      const view = makeView({
        product: baseView.product,
        createdAt: fakerCreatedAt,
      })

      await inMemoryViewsRepository.create(view)
    }

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    thirtyDaysAgo.setHours(0, 0, 0, 0)

    const result = await sut.execute({
      sellerId: seller.id.toValue(),
      from: thirtyDaysAgo,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      amount: 15,
    })
  })

  it('should not be able to count views of a non-existent seller', async () => {
    const result = await sut.execute({
      sellerId: 'seller-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
