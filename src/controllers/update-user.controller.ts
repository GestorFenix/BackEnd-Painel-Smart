import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import {
  Body,
  ConflictException,
  Controller,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'

const updateUserBodySchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(updateUserBodySchema)

type UpdateUserBodySchema = z.infer<typeof updateUserBodySchema>

@Controller('user/:id')
@ApiTags('Franquias')
@ApiBearerAuth()
export class UpdateUserController {
  constructor(private readonly prisma: PrismaService) {}

  @Put()
  @ApiOperation({ summary: 'Rota para atualizar informações da franquia.' })
  async handle(
    @Body(bodyValidationPipe) body: UpdateUserBodySchema,
    @Param('id') id: string,
  ) {
    const { email, name } = body

    const user = await this.prisma.users.findUnique({
      where: {
        id,
      },
    })

    if (!user) throw new NotFoundException('User not found.')

    const isEmailAlreadyInUse = await this.prisma.users.findUnique({
      where: {
        email,
      },
    })

    if (isEmailAlreadyInUse)
      throw new ConflictException('E-mail already in use.')

    await this.prisma.users.update({
      where: {
        id,
      },
      data: {
        name,
        email,
      },
    })
  }
}
