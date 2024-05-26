import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create account (e2e)', () => {
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

  test('[POST] /user', async () => {
    const response = await request(app.getHttpServer()).post('/user').send({
      name: 'Saul Gomes',
      email: 'saul.contatodev@gmail.com',
      password: '123456',
      phone: '(71) 99999-9999',
    })

    expect(response.statusCode).toBe(201)

    const userExists = await prisma.users.findUnique({
      where: {
        email: 'saul.contatodev@gmail.com',
      },
    })

    expect(userExists).toBeTruthy()
  })
})
