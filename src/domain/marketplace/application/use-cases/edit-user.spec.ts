import { InMemorySellersRepository } from 'test/repositories/in-memory-user-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { EditSellerUseCase } from './edit-user'
import { makeSeller } from 'test/factories/make-seller'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemorySellersRepository: InMemorySellersRepository
let fakeHasher: FakeHasher
let sut: EditSellerUseCase

describe('Edit User', () => {
  beforeEach(() => {
    inMemorySellersRepository = new InMemorySellersRepository()
    fakeHasher = new FakeHasher()

    sut = new EditSellerUseCase(inMemorySellersRepository, fakeHasher)
  })

  it('should be able to register and change a user', async () => {
    const newUser = makeSeller({}, new UniqueEntityID('user-1'))

    await inMemorySellersRepository.create(newUser)

    await sut.execute({
      sellerId: 'user-1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      avatarId: 'avatar-id',
      phone: '123456789',
    })

    expect(inMemorySellersRepository.items[0]).toMatchObject({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456-hashed',
      avatarId: 'avatar-id',
      phone: '123456789',
    })
  })
})
