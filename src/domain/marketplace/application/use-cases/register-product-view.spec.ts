import { RegisterProductViewUseCase } from './register-product-view'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { InMemoryViewersRepository } from 'test/repositories/in-memory-viewers-repository'
import { InMemoryViewsRepository } from 'test/repositories/in-memory-views-repository'
import { makeProduct } from 'test/factories/make-product'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeViewer } from 'test/factories/make-viewer'
import { makeView } from 'test/factories/make-view'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryProductsRepository: InMemoryProductsRepository
let inMemoryViewersRepository: InMemoryViewersRepository
let inMemoryViewsRepository: InMemoryViewsRepository
let sut: RegisterProductViewUseCase

describe('Register Product View', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    inMemoryViewersRepository = new InMemoryViewersRepository()
    inMemoryViewsRepository = new InMemoryViewsRepository()
    sut = new RegisterProductViewUseCase(
      inMemoryProductsRepository,
      inMemoryViewersRepository,
      inMemoryViewsRepository,
    )
  })

  it('should be able to register a product view', async () => {
    const product = makeProduct({ ownerId: new UniqueEntityID('user-1') })
    await inMemoryProductsRepository.create(product)

    const viewer = makeViewer({}, new UniqueEntityID('user-2'))
    await inMemoryViewersRepository.create(viewer)

    const result = await sut.execute({
      productId: product.id.toValue(),
      viewerId: viewer.id.toValue(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.view.id).toBeTruthy()
    expect(inMemoryViewsRepository.items[0].id).toEqual(result.value?.view.id)
  })

  it('should not be able to register a view on a non-existent product', async () => {
    const viewer = makeViewer({}, new UniqueEntityID('user-1'))
    await inMemoryViewersRepository.create(viewer)

    const result = await sut.execute({
      productId: 'product-1',
      viewerId: viewer.id.toValue(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to register a product view with a non-existent user', async () => {
    const product = makeProduct({ ownerId: new UniqueEntityID('user-1') })
    await inMemoryProductsRepository.create(product)

    const result = await sut.execute({
      productId: product.id.toValue(),
      viewerId: 'user-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to register a product view with the product owner', async () => {
    const product = makeProduct({ ownerId: new UniqueEntityID('user-1') })
    await inMemoryProductsRepository.create(product)

    const viewer = makeViewer({}, new UniqueEntityID('user-1'))
    await inMemoryViewersRepository.create(viewer)

    const result = await sut.execute({
      productId: product.id.toValue(),
      viewerId: viewer.id.toValue(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to register a duplicate product view', async () => {
    const product = makeProduct({ ownerId: new UniqueEntityID('user-1') })
    await inMemoryProductsRepository.create(product)

    const viewer = makeViewer({}, new UniqueEntityID('user-2'))
    await inMemoryViewersRepository.create(viewer)

    const view = makeView({ product, viewer })
    await inMemoryViewsRepository.create(view)

    const result = await sut.execute({
      productId: view.product.id.toValue(),
      viewerId: view.viewer.id.toValue(),
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
