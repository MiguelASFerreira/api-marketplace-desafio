import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser'
import { EnvService } from './env/env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })

  const envService = app.get(EnvService)

  const PORT = envService.get('PORT')

  app.use(cookieParser())

  await app.listen(PORT ?? 3000)
}
bootstrap()
