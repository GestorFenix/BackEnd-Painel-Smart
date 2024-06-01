import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { compare, hash } from 'bcryptjs'
import request from 'supertest'

describe('Update user (e2e)', () => {
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

  test('[PUT] /user/:id/password', async () => {
    const user = await prisma.users.create({
      data: {
        name: 'Saul Gomes',
        email: 'saul.contatodev@gmail.com',
        password: await hash('123456', 8),
      },
    })

    const token = jwt.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .put(`/user/${user.id}/password`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        password: '123456',
        newPassword: '12345678',
      })

    expect(response.statusCode).toBe(200)

    const updatedUser = await prisma.users.findUnique({
      where: {
        id: user.id,
      },
    })

    const isPasswordUpdated = await compare('12345678', updatedUser?.password!)

    expect(isPasswordUpdated).toBeTruthy()
  })

  test('Must not be able to update a user with invalid password', async () => {
    const user = await prisma.users.create({
      data: {
        name: 'Saul Gomes',
        email: 'saul.contato2@gmail.com',
        password: await hash('123456', 8),
      },
    })

    const token = jwt.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .put(`/user/${user.id}/password`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        password: '1234567',
        newPassword: '12345678',
      })

    expect(response.statusCode).toBe(401)
  })

  test('Must not be able to update a user with invalid id', async () => {
    const user = await prisma.users.create({
      data: {
        name: 'Saul Gomes',
        email: 'saul.contato@gmail.com',
        password: await hash('123456', 8),
      },
    })

    const token = jwt.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .get('/user/invalid-id')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(404)
  })

  test('Must not be able to update a user with invalid token', async () => {
    const response = await request(app.getHttpServer())
      .get('/user/invalid-id')
      .set('Authorization', 'invalid-token')

    expect(response.statusCode).toBe(401)
  })
})
