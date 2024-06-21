import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { Body, Controller, NotFoundException, Param, Put } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'

const updateUserBodySchema = z.object({
  logo: z.string().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(updateUserBodySchema)

type UpdateUserBodySchema = z.infer<typeof updateUserBodySchema>

@Controller('user/:id/logo')
@ApiTags('Franquias')
export class UpdateLogo {
  constructor(private readonly prisma: PrismaService) {}

  @Put()
  @ApiOperation({
    summary: 'Rota para atualizar a logo que vai ser usada no aplicativo.',
  })
  async handle(
    @Body(bodyValidationPipe) body: UpdateUserBodySchema,
    @Param('id') id: string,
  ) {
    const { logo } = body

    const franchise = await this.prisma.users.findUnique({
      where: {
        id,
      },
    })

    if (!franchise) throw new NotFoundException('Resource not found.')

    await this.prisma.users.update({
      where: {
        id,
      },
      data: {
        logoImage: logo,
      },
    })
  }
}
