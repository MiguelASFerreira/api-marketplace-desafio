import { InMemorySellersRepository } from 'test/repositories/in-memory-seller-repository'
import { RegisterSellerUseCase } from './register-seller'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let inMemorySellersRepository: InMemorySellersRepository
let fakeHasher: FakeHasher

let sut: RegisterSellerUseCase

describe('Register User', () => {
  beforeEach(() => {
    inMemorySellersRepository = new InMemorySellersRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterSellerUseCase(inMemorySellersRepository, fakeHasher)
  })

  it('should be able to register a new user', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      avatarId: 'avatar-id',
      phone: '123456789',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      user: inMemorySellersRepository.items[0],
    })
  })

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      avatarId: 'avatar-id',
      phone: '123456789',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemorySellersRepository.items[0].password).toEqual(hashedPassword)
  })
})
