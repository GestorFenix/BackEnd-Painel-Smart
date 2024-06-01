import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import type { Env } from './env'

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: ['warn', 'error'],
	})

	const configService = app.get<ConfigService<Env, true>>(ConfigService)
	const port = configService.get('PORT', { infer: true })

	const config = new DocumentBuilder()
		.setTitle('Infinity')
		.setVersion('1.0')
		.build()

	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('docs', app, document)

	await app.listen(port)
}
bootstrap()
