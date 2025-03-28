import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemorySellersRepository } from 'test/repositories/in-memory-seller-repository'
import { AuthenticateUseCase } from './authenticate-seller'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { makeSeller } from 'test/factories/make-seller'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

let inMemorySellersRepository: InMemorySellersRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateUseCase

describe('Authenticate Seller', () => {
  beforeEach(() => {
    inMemorySellersRepository = new InMemorySellersRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    sut = new AuthenticateUseCase(
      inMemorySellersRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a seller', async () => {
    const seller = makeSeller({
      email: 'johndoe@example.com.br',
      password: await fakeHasher.hash('123456'),
    })

    inMemorySellersRepository.items.push(seller)

    const result = await sut.execute({
      email: 'johndoe@example.com.br',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should not be able to authenticate a seller with wrong email', async () => {
    const seller = makeSeller({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    })

    inMemorySellersRepository.items.push(seller)

    const result = await sut.execute({
      email: 'wrong@email.com',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should not be able to authenticate a seller with wrong password', async () => {
    const seller = makeSeller({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    })

    inMemorySellersRepository.items.push(seller)

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})
