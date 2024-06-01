import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Get users (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /users/online', async () => {
    const now = new Date()
    const tenMinutesAgo = new Date(Date.now() - 11 * 60 * 1000 - 1000) // 10 minutos e 1 segundo atrás

    await prisma.users.create({
      data: {
        name: 'Saul Gomes',
        email: 'saul.contatodev@gmail.com',
        password: await hash('123456', 8),
        lastLogin: tenMinutesAgo,
      },
    })

    const user = await prisma.users.create({
      data: {
        name: 'Saul Gomes',
        email: 'saul.2@gmail.com',
        password: await hash('123456', 8),
        lastLogin: now,
      },
    })

    const token = jwt.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .get('/users/online')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBe(1)
  })

  test('Must not be able to get a user with invalid token', async () => {
    const response = await request(app.getHttpServer())
      .get('/user/invalid-id')
      .set('Authorization', 'invalid-token')

    expect(response.statusCode).toBe(401)
  })

  test('Must not be able to delete a user with invalid token', async () => {
    const response = await request(app.getHttpServer())
      .get('/user/invalid-id')
      .set('Authorization', 'invalid-token')

    expect(response.statusCode).toBe(401)
  })
})
