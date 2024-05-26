import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
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

  test('[PUT] /user/:id', async () => {
    const user = await prisma.users.create({
      data: {
        name: 'Saul Gomes',
        email: 'saul.contatodev@gmail.com',
        password: await hash('123456', 8),
      },
    })

    const token = jwt.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .put(`/user/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'saul.contatodev2@gmail.com',
        name: 'Saul Alterado',
      })

    expect(response.statusCode).toBe(200)

    const updatedUser = await prisma.users.findUnique({
      where: {
        id: user.id,
      },
    })

    expect(updatedUser?.name).toEqual('Saul Alterado')
    expect(updatedUser?.email).toEqual('saul.contatodev2@gmail.com')
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
      .get(`/user/invalid-id`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(404)
  })

  test('Must not be able to update a user with invalid token', async () => {
    const response = await request(app.getHttpServer())
      .get(`/user/invalid-id`)
      .set('Authorization', 'invalid-token')

    expect(response.statusCode).toBe(401)
  })
})
