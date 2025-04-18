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
import { CreateProductController } from './controllers/create-product.controller'
import { CreateProductUseCase } from '@/domain/marketplace/application/use-cases/create-product'
import { EditProductController } from './controllers/edit-product.controller'
import { EditProductUseCase } from '@/domain/marketplace/application/use-cases/edit-product'
import { GetProductByIdController } from './controllers/get-product-by-id.controller'
import { GetProductByIdUseCase } from '@/domain/marketplace/application/use-cases/get-product-by-id'
import { FetchAllProductsController } from './controllers/fetch-all-products.controller'
import { FetchAllProductsUseCase } from '@/domain/marketplace/application/use-cases/fetch-all-products'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    RegisterSellerController,
    AuthenticateSellerController,
    EditSellerController,
    GetSellerProfileController,
    CreateProductController,
    EditProductController,
    GetProductByIdController,
    FetchAllProductsController,
  ],
  providers: [
    RegisterSellerUseCase,
    AuthenticateUseCase,
    EditSellerUseCase,
    GetSellerProfileUseCase,
    CreateProductUseCase,
    EditProductUseCase,
    GetProductByIdUseCase,
    FetchAllProductsUseCase,
  ],
})
export class HttpModule {}
