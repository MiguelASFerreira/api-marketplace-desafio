import { CountProductViewsUseCase } from './count-product-views'
import { InMemoryViewsRepository } from 'test/repositories/in-memory-views-repository'
import { makeView } from 'test/factories/make-view'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { makeProduct } from 'test/factories/make-product'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let inMemoryProductsRepository: InMemoryProductsRepository
let inMemoryViewsRepository: InMemoryViewsRepository
let sut: CountProductViewsUseCase

describe('Count Product Views', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    inMemoryViewsRepository = new InMemoryViewsRepository()
    sut = new CountProductViewsUseCase(
      inMemoryProductsRepository,
      inMemoryViewsRepository,
    )
  })

  it('should be able to count the views received by the product in the last 7 days', async () => {
    const product = makeProduct()
    await inMemoryProductsRepository.create(product)

    for (let i = 1; i <= 10; i++) {
      const fakerCreatedAt = new Date()
      fakerCreatedAt.setDate(fakerCreatedAt.getDate() - i)

      const view = makeView({
        product,
        createdAt: fakerCreatedAt,
      })

      await inMemoryViewsRepository.create(view)
    }

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const result = await sut.execute({
      productId: product.id.toValue(),
      from: sevenDaysAgo,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      amount: 7,
    })
  })

  it('should not be able to count views of a non-existent product', async () => {
    const view = makeView()
    await inMemoryViewsRepository.create(view)

    const result = await sut.execute({
      productId: 'product-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
