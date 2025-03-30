import { CreateProductUseCase } from './create-product'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'

let inMemoryProductsRepository: InMemoryProductsRepository
let sut: CreateProductUseCase

describe('Create Product', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    sut = new CreateProductUseCase(inMemoryProductsRepository)
  })

  it('should be able to create a product', async () => {
    const result = await sut.execute({
      title: 'Novo produto',
      description: 'Descrição do produto',
      priceInCents: 1000,
      ownerId: '1',
      categoryId: '1',
    })

    expect(result.value?.product.id).toBeTruthy()
    expect(inMemoryProductsRepository.items[0].id).toEqual(
      result.value?.product.id,
    )
  })
})
