import { Public } from '@/auth/public'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { CreateUserBodyDto } from '@/swagger/create-user-body.dto'
import {
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { hash } from 'bcryptjs'
import { z } from 'zod'

const createUserBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  dns: z.string(),
})

type CreateUserBodySchema = z.infer<typeof createUserBodySchema>

@Controller('user')
@ApiTags('Franquias')
@Public()
@UsePipes(new ZodValidationPipe(createUserBodySchema))
export class CreateUserController {
  constructor(private readonly prisma: PrismaService) { }

  @Post()
  @ApiOperation({ summary: 'Cria uma nova franquia.' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateUserBodyDto })
  async handle(@Body() body: CreateUserBodySchema) {
    const { email, password, name, dns } = body

    const userWithSameEmail = await this.prisma.users.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) throw new ConflictException('E-mail already in use.')

    const hashedPassword = await hash(password, 8)

    await this.prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        Franchises: {
          create: {
            dns,
          },
        },
      },
    })
  }
}
