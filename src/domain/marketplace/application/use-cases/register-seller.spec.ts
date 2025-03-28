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

  it('should be able to register a seller without avatar', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      phone: '123456789',
      email: 'johndoe@example.com',
      avatarId: '',
      password: '123456',
      passwordConfirmation: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      seller: expect.objectContaining({
        email: 'johndoe@example.com',
      }),
    })
  })
})
