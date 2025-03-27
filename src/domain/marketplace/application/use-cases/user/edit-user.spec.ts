import { InMemoryUsersRepository } from 'test/repositories/in-memory-user-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { EditUserUseCase } from './edit-user'
import { makeUser } from 'test/factories/make-user'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let sut: EditUserUseCase

describe('Edit User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()

    sut = new EditUserUseCase(inMemoryUsersRepository, fakeHasher)
  })

  it('should be able to register and change a user', async () => {
    const newUser = makeUser({}, new UniqueEntityID('user-1'))

    await inMemoryUsersRepository.create(newUser)

    await sut.execute({
      userId: 'user-1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      avatarId: 'avatar-id',
      phone: '123456789',
    })

    expect(inMemoryUsersRepository.items[0]).toMatchObject({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456-hashed',
      avatarId: 'avatar-id',
      phone: '123456789',
    })
  })
})
