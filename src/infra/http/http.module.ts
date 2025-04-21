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
import { FetchProductsByOwnerController } from './controllers/fetch-products-by-owner.controller'
import { FetchProductsByOwnerIdUseCase } from '@/domain/marketplace/application/use-cases/fetch-products-by-owner'
import { ChangeProductStatusController } from './controllers/change-product-status.controller'
import { ChangeProductStatusUseCase } from '@/domain/marketplace/application/use-cases/change-product-status'
import { FetchAllCategoriesController } from './controllers/fetch-all-categories.controller'
import { FetchAllCategoriesUseCase } from '@/domain/marketplace/application/use-cases/fetch-all-categories'
import { SignOutController } from './controllers/sign-out.controller'
import { UploadAttachmenstController } from './controllers/upload-attachments.controller'
import { StorageModule } from '../storage/storage.module'
import { UploadAndCreateAttachmentUseCase } from '@/domain/marketplace/application/use-cases/upload-and-create-attachment'
import { RegisterProductViewController } from './controllers/register-product-view.controller'
import { RegisterProductViewUseCase } from '@/domain/marketplace/application/use-cases/register-product-view'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    RegisterSellerController,
    AuthenticateSellerController,
    EditSellerController,
    GetSellerProfileController,
    CreateProductController,
    EditProductController,
    GetProductByIdController,
    FetchAllProductsController,
    FetchProductsByOwnerController,
    ChangeProductStatusController,
    FetchAllCategoriesController,
    SignOutController,
    UploadAttachmenstController,
    RegisterProductViewController,
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
    FetchProductsByOwnerIdUseCase,
    ChangeProductStatusUseCase,
    FetchAllCategoriesUseCase,
    UploadAndCreateAttachmentUseCase,
    RegisterProductViewUseCase,
  ],
})
export class HttpModule {}
