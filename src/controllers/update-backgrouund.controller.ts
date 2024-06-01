import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { Body, Controller, NotFoundException, Param, Put } from '@nestjs/common'
import { z } from 'zod'

const updateUserBodySchema = z.object({
  background: z.string().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(updateUserBodySchema)

type UpdateUserBodySchema = z.infer<typeof updateUserBodySchema>

@Controller('user/:id/background')
export class UpdateBackground {
  constructor(private readonly prisma: PrismaService) {}

  @Put()
  async handle(
    @Body(bodyValidationPipe) body: UpdateUserBodySchema,
    @Param('id') id: string,
  ) {
    const { background } = body

    const franchise = await this.prisma.franchises.findUnique({
      where: {
        id: Number(id),
      },
    })

    if (!franchise) throw new NotFoundException('Resource not found.')

    await this.prisma.franchises.update({
      where: {
        id: Number(id),
      },
      data: {
        backgroundImage: background,
      },
    })
  }
}
