import { CreateProductUseCase } from './create-product'
import { InMemorySellersRepository } from 'test/repositories/in-memory-seller-repository'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { makeSeller } from 'test/factories/make-seller'

let inMemorySellersRepository: InMemorySellersRepository
let inMemoryProductsRepository: InMemoryProductsRepository
let sut: CreateProductUseCase

describe('Create Product', () => {
  beforeEach(() => {
    inMemorySellersRepository = new InMemorySellersRepository()
    inMemoryProductsRepository = new InMemoryProductsRepository()

    sut = new CreateProductUseCase(
      inMemorySellersRepository,
      inMemoryProductsRepository,
    )
  })

  it('should be able to create a product', async () => {
    const seller = makeSeller()

    await inMemorySellersRepository.create(seller)

    const result = await sut.execute({
      title: 'Novo produto',
      description: 'Descrição do produto',
      priceInCents: 1000,
      ownerId: seller.id.toString(),
      categoryId: '1',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      product: expect.objectContaining({
        title: 'Novo produto',
        description: 'Descrição do produto',
        priceInCents: 1000,
        ownerId: expect.objectContaining({ value: seller.id.toString() }),
        categoryId: expect.objectContaining({ value: expect.any(String) }),
        status: expect.any(String),
        createdAt: expect.any(Date),
      }),
    })
  })
})
