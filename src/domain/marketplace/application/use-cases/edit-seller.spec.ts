import { InMemorySellersRepository } from 'test/repositories/in-memory-seller-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { EditSellerUseCase } from './edit-seller'
import { makeSeller } from 'test/factories/make-seller'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { PhoneAlreadyExistsError } from './errors/phone-already-exists-error'
import { EmailAlreadyExistsError } from './errors/email-already-exists-error'

let inMemorySellersRepository: InMemorySellersRepository
let fakeHasher: FakeHasher
let sut: EditSellerUseCase

describe('Edit User', () => {
  beforeEach(() => {
    inMemorySellersRepository = new InMemorySellersRepository()
    fakeHasher = new FakeHasher()

    sut = new EditSellerUseCase(
      inMemorySellersRepository,
      fakeHasher,
      fakeHasher,
    )
  })

  it('should be able to edit a seller', async () => {
    const seller = makeSeller()
    await inMemorySellersRepository.create(seller)

    const result = await sut.execute({
      sellerId: seller.id.toString(),
      name: 'John Doe',
      phone: '123456789',
      email: 'johndoe@example.com',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      seller: expect.objectContaining({
        email: 'johndoe@example.com',
      }),
    })
  })

  it('should hash seller new password upon edition', async () => {
    const seller = makeSeller({ password: await fakeHasher.hash('123456') })
    await inMemorySellersRepository.create(seller)

    const result = await sut.execute({
      sellerId: seller.id.toString(),
      name: seller.name,
      phone: seller.phone,
      email: seller.email,
      password: '123456',
      newPassword: '456789',
    })

    const hashedPassword = await fakeHasher.hash('456789')

    expect(result.isRight()).toBe(true)
    expect(inMemorySellersRepository.items[0].password).toEqual(hashedPassword)
  })

  it('should not be able to edit a seller password with wrong current password', async () => {
    const seller = makeSeller({ password: await fakeHasher.hash('123456') })
    await inMemorySellersRepository.create(seller)

    const result = await sut.execute({
      sellerId: seller.id.toString(),
      name: seller.name,
      phone: seller.phone,
      email: seller.email,
      password: '123',
      newPassword: '456789',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should not be able to edit a seller with an already registered email', async () => {
    const seller1 = makeSeller({ email: 'johndoe@example.com' })
    await inMemorySellersRepository.create(seller1)

    const seller2 = makeSeller({ email: 'test@example.com' })
    await inMemorySellersRepository.create(seller2)

    const result = await sut.execute({
      sellerId: seller2.id.toString(),
      name: 'John Doe',
      phone: '123456789',
      email: 'johndoe@example.com',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(EmailAlreadyExistsError)
  })

  it('should not be able to edit a seller with an already registered phone', async () => {
    const seller1 = makeSeller({ phone: '123456789' })
    await inMemorySellersRepository.create(seller1)

    const seller2 = makeSeller({ phone: '000000000' })
    await inMemorySellersRepository.create(seller2)

    const result = await sut.execute({
      sellerId: seller2.id.toString(),
      name: 'John Doe',
      phone: '123456789',
      email: 'johndoe@example.com',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PhoneAlreadyExistsError)
  })
})
