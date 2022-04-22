import csurf from 'csurf'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { __DEV__ } from './constants'
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.setGlobalPrefix('/api')
  app.useStaticAssets('uploads', {
    prefix: '/uploads',
  })
  // development
  if (__DEV__) {
    app.enableCors()
    // production
  } else {
    // use at the first
    app.use(helmet())
    // csrf
    app.use(csurf())
    // ddos, limit speed
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
      })
    )
  }
  await app.listen(3000)
}
bootstrap()
