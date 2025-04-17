import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { RegisterSellerController } from './controllers/register-seller.controller'
import { RegisterSellerUseCase } from '@/domain/marketplace/application/use-cases/register-seller'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { AuthenticateSellerController } from './controllers/authenticate-seller.controller'
import { AuthenticateUseCase } from '@/domain/marketplace/application/use-cases/authenticate-seller'
import { EditSellerController } from './controllers/edit-seller.controller'
import { EditSellerUseCase } from '@/domain/marketplace/application/use-cases/edit-seller'
import { GetSellerProfileController } from './controllers/get-seller-profile.controller'
import { GetSellerProfileUseCase } from '@/domain/marketplace/application/use-cases/get-seller-profile'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    RegisterSellerController,
    AuthenticateSellerController,
    EditSellerController,
    GetSellerProfileController,
  ],
  providers: [
    RegisterSellerUseCase,
    AuthenticateUseCase,
    EditSellerUseCase,
    GetSellerProfileUseCase,
  ],
})
export class HttpModule {}
