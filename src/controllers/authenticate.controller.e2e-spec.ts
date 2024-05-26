import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Authenticate (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /login', async () => {
    await prisma.users.create({
      data: {
        name: 'Saul Gomes',
        email: 'saul.contatodev@gmail.com',
        password: await hash('123456', 8),
        // phone: '(71) 99999-9999',
      },
    })

    const response = await request(app.getHttpServer()).post('/login').send({
      email: 'saul.contatodev@gmail.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(201)

    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
