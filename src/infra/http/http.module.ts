import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { RegisterSellerController } from './controllers/register-seller.controller'
import { RegisterSellerUseCase } from '@/domain/marketplace/application/use-cases/register-seller'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { AuthenticateSellerController } from './controllers/authenticate-seller.controller'
import { AuthenticateUseCase } from '@/domain/marketplace/application/use-cases/authenticate-seller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [RegisterSellerController, AuthenticateSellerController],
  providers: [RegisterSellerUseCase, AuthenticateUseCase],
})
export class HttpModule {}
