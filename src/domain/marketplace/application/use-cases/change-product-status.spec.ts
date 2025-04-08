import { ChangeProductStatusUseCase } from './change-product-status'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { makeProduct } from 'test/factories/make-product'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemorySellersRepository } from 'test/repositories/in-memory-seller-repository'
import { makeSeller } from 'test/factories/make-seller'
import { ProductStatus } from '../../enterprise/entities/product'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryUserAttachmentsRepository } from 'test/repositories/in-memory-user-attachments-repository'

let inMemoryUserAttachmentsRepository: InMemoryUserAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemorySellersRepository: InMemorySellersRepository
let inMemoryProductsRepository: InMemoryProductsRepository
let sut: ChangeProductStatusUseCase

describe('Change Product status', () => {
  beforeEach(() => {
    inMemoryUserAttachmentsRepository = new InMemoryUserAttachmentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemorySellersRepository = new InMemorySellersRepository(
      inMemoryUserAttachmentsRepository,
      inMemoryAttachmentsRepository,
    )
    inMemoryProductsRepository = new InMemoryProductsRepository()

    sut = new ChangeProductStatusUseCase(
      inMemorySellersRepository,
      inMemoryProductsRepository,
    )
  })

  it('should be able to change a product status', async () => {
    const seller = makeSeller()

    await inMemorySellersRepository.create(seller)

    const product = makeProduct({
      ownerId: seller.id,
    })

    await inMemoryProductsRepository.create(product)

    const result = await sut.execute({
      productId: product.id.toValue(),
      ownerId: product.ownerId.toValue(),
      newStatus: ProductStatus.SOLD,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryProductsRepository.items[0]).toEqual(result.value?.product)
  })

  it('should not be able to change a product status from a non-existent user', async () => {
    const product = makeProduct()

    await inMemoryProductsRepository.create(product)

    const result = await sut.execute({
      productId: product.id.toValue(),
      ownerId: 'owner-1',
      newStatus: ProductStatus.SOLD,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to change the status of a non-existent product', async () => {
    const seller = makeSeller()

    await inMemorySellersRepository.create(seller)

    const result = await sut.execute({
      productId: 'product-id',
      ownerId: seller.id.toValue(),
      newStatus: ProductStatus.SOLD,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it("should not be able to change the status of another user's product", async () => {
    const seller = makeSeller({}, new UniqueEntityID('seller-1'))
    await inMemorySellersRepository.create(seller)

    const product = makeProduct({
      ownerId: new UniqueEntityID('seller-2'),
    })

    await inMemoryProductsRepository.create(product)

    const result = await sut.execute({
      productId: product.id.toValue(),
      ownerId: 'seller-1',
      newStatus: ProductStatus.SOLD,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to mark as cancelled a sold product', async () => {
    const seller = makeSeller()

    await inMemorySellersRepository.create(seller)

    const product = makeProduct({
      ownerId: seller.id,
      status: ProductStatus.SOLD,
    })

    await inMemoryProductsRepository.create(product)

    const result = await sut.execute({
      productId: product.id.toValue(),
      ownerId: seller.id.toValue(),
      newStatus: ProductStatus.CANCELLED,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to mark as sold a cancelled product', async () => {
    const seller = makeSeller()

    await inMemorySellersRepository.create(seller)

    const product = makeProduct({
      ownerId: seller.id,
      status: ProductStatus.CANCELLED,
    })

    await inMemoryProductsRepository.create(product)

    const result = await sut.execute({
      productId: product.id.toValue(),
      ownerId: seller.id.toValue(),
      newStatus: ProductStatus.SOLD,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
